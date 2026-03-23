#!/usr/bin/env python3
"""
Ayahuasca Research Portal — Automated Article Ingestion
========================================================
Queries PubMed for new ayahuasca research papers, validates each one
thoroughly, appends to articles.js, and generates a newsletter digest.

Usage:
  python ingest.py                    # Normal run (fetch + validate + commit)
  python ingest.py --dry-run          # Preview what would be added (no changes)
  python ingest.py --days 30          # Look back 30 days instead of default 15
  python ingest.py --send-digest      # Also send newsletter via Buttondown
"""

import os
import re
import sys
import json
import time
import argparse
import logging
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from urllib.request import urlopen, Request
from urllib.parse import quote, urlencode
from urllib.error import URLError, HTTPError

# ============================================================
# CONFIGURATION
# ============================================================

PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
DOI_API = "https://api.crossref.org/works"
BUTTONDOWN_API = "https://api.buttondown.com/v1/emails"

# Search terms — covers all common names and components
SEARCH_QUERIES = [
    "ayahuasca",
    "Banisteriopsis caapi",
    '"DMT" AND "harmine" AND ("brew" OR "tea" OR "ceremony" OR "ritual")',
    "hoasca AND (ritual OR ceremony OR therapeutic OR pharmacol*)",
    '"Santo Daime" AND (pharmacol* OR therap* OR mental OR psychiatr*)',
    '"União do Vegetal" AND (pharmacol* OR therap* OR mental OR health)',
]

# Relevance keywords — at least one must appear in title OR abstract
RELEVANCE_TERMS = [
    "ayahuasca", "banisteriopsis", "caapi", "hoasca",
    "santo daime", "união do vegetal", "udv",
    "dmt.*harmine", "dmt.*harmaline", "dmt.*beta-carboline",
    "chacruna", "psychotria viridis", "jurema",
    "daime", "vegetal",
]

# Category assignment rules (checked in order, first match wins)
CATEGORY_RULES = [
    ("Clinical Trials", [
        r"randomized.*trial", r"placebo.*controlled", r"clinical trial",
        r"open.label.*trial", r"double.blind", r"rct\b"
    ]),
    ("Depression & Mood", [
        r"depress", r"antidepress", r"mood disorder", r"affective",
        r"treatment.resistant depression", r"trd\b"
    ]),
    ("PTSD", [
        r"\bptsd\b", r"post.?traumatic", r"trauma.*stress"
    ]),
    ("Grief & Trauma", [
        r"grief", r"bereavement", r"mourning", r"loss.*loved",
        r"prolonged grief"
    ]),
    ("Addiction", [
        r"addict", r"substance.*use.*disorder", r"alcohol.*depend",
        r"drug.*depend", r"tobacco", r"smoking.*cessation",
        r"anti.?addictive"
    ]),
    ("Neuroscience", [
        r"fmri\b", r"neuroimaging", r"\beeg\b", r"brain.*network",
        r"default mode", r"neural.*correlat", r"cortical",
        r"serotonin.*receptor", r"5.ht2a", r"connectome",
        r"resting.state", r"bold.*signal"
    ]),
    ("Pharmacology", [
        r"pharmacokinet", r"pharmacodynam", r"bioavailab",
        r"dose.response", r"plasma.*concentration", r"metabol",
        r"receptor.*binding", r"cytochrome", r"mao.*inhibit"
    ]),
    ("Safety", [
        r"adverse.*effect", r"toxicity", r"safety.*profile",
        r"contraindication", r"serotonin syndrome", r"psychosis.*risk",
        r"cardiac", r"hepatotox"
    ]),
    ("Psychology", [
        r"mindfulness", r"personality", r"well.?being", r"quality of life",
        r"connectedness", r"ego.*dissolution", r"mystical.*experience",
        r"cognitive", r"emotional.*process", r"self.?compassion"
    ]),
    ("Ethnobotany", [
        r"indigenous", r"traditional.*use", r"ethnobotany", r"shamanic",
        r"ritual.*context", r"ceremony", r"anthropolog", r"cultural"
    ]),
    ("Reviews", [
        r"systematic.*review", r"meta.analysis", r"narrative.*review",
        r"scoping.*review", r"literature.*review", r"comprehensive.*review"
    ]),
]

# Study type detection rules
STUDY_TYPE_RULES = [
    ("Randomized Controlled Trial", [r"randomized.*controlled", r"double.blind.*placebo", r"\brct\b"]),
    ("Open-label trial", [r"open.label", r"uncontrolled.*trial"]),
    ("Systematic review", [r"systematic.*review"]),
    ("Meta-analysis", [r"meta.analysis"]),
    ("Narrative review", [r"narrative.*review", r"scoping.*review", r"literature.*review"]),
    ("Cross-sectional survey", [r"cross.sectional.*survey", r"survey.*study"]),
    ("Longitudinal observational", [r"longitudinal", r"prospective.*follow"]),
    ("Prospective observational", [r"prospective.*observ", r"prospective.*study"]),
    ("Ethnographic / qualitative", [r"qualitative", r"ethnograph", r"thematic.*analysis", r"grounded.*theory"]),
    ("Neuroimaging study", [r"fmri", r"neuroimaging", r"\beeg\b", r"pet.*scan", r"spect"]),
    ("Pharmacokinetic study", [r"pharmacokinet", r"bioavailab", r"plasma.*concentration"]),
    ("Preclinical / in vivo", [r"animal.*model", r"in.*vivo", r"rodent", r"primate"]),
    ("Preclinical / in vitro", [r"in.*vitro", r"cell.*culture", r"receptor.*assay"]),
    ("Case report", [r"case.*report", r"case.*series"]),
    ("Clinical trial protocol", [r"protocol", r"study.*design"]),
]

# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
log = logging.getLogger("ingest")

# ============================================================
# PUBMED API
# ============================================================

def api_get(url, max_retries=3):
    """Fetch URL with retries and rate limiting."""
    for attempt in range(max_retries):
        try:
            req = Request(url, headers={"User-Agent": "AyahuascaPortal/1.0"})
            with urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8")
        except (URLError, HTTPError) as e:
            log.warning(f"API request failed (attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise
    return None


def search_pubmed(query, days_back=15, api_key=None):
    """Search PubMed and return list of PMIDs."""
    date_from = (datetime.now() - timedelta(days=days_back)).strftime("%Y/%m/%d")
    date_to = datetime.now().strftime("%Y/%m/%d")
    
    params = {
        "db": "pubmed",
        "term": query,
        "datetype": "edat",  # Entrez date (when added to PubMed)
        "mindate": date_from,
        "maxdate": date_to,
        "retmax": 100,
        "retmode": "json",
        "sort": "date",
    }
    if api_key:
        params["api_key"] = api_key
    
    url = f"{PUBMED_BASE}/esearch.fcgi?{urlencode(params, quote_via=quote)}"
    log.info(f"Searching PubMed: {query[:60]}...")
    
    try:
        raw = api_get(url)
        data = json.loads(raw)
        ids = data.get("esearchresult", {}).get("idlist", [])
        count = data.get("esearchresult", {}).get("count", "0")
        log.info(f"  Found {count} results, retrieved {len(ids)} PMIDs")
        return ids
    except Exception as e:
        log.error(f"  Search failed: {e}")
        return []


def fetch_pubmed_records(pmids, api_key=None):
    """Fetch full article records from PubMed by PMID list."""
    if not pmids:
        return []
    
    # Process in batches of 50
    all_articles = []
    for i in range(0, len(pmids), 50):
        batch = pmids[i:i+50]
        params = {
            "db": "pubmed",
            "id": ",".join(batch),
            "retmode": "xml",
            "rettype": "full",
        }
        if api_key:
            params["api_key"] = api_key
        
        url = f"{PUBMED_BASE}/efetch.fcgi?{urlencode(params)}"
        log.info(f"Fetching {len(batch)} records from PubMed...")
        
        try:
            xml_data = api_get(url)
            articles = parse_pubmed_xml(xml_data)
            all_articles.extend(articles)
            time.sleep(0.4)  # Rate limit: ~3 requests/sec without key
        except Exception as e:
            log.error(f"  Fetch failed: {e}")
    
    return all_articles


def parse_pubmed_xml(xml_text):
    """Parse PubMed XML response into structured article dicts."""
    articles = []
    root = ET.fromstring(xml_text)
    
    for article_elem in root.findall(".//PubmedArticle"):
        try:
            art = parse_single_article(article_elem)
            if art:
                articles.append(art)
        except Exception as e:
            log.warning(f"  Failed to parse article: {e}")
    
    return articles


def parse_single_article(elem):
    """Parse a single PubmedArticle XML element."""
    medline = elem.find(".//MedlineCitation")
    article = medline.find(".//Article") if medline is not None else None
    if article is None:
        return None
    
    # PMID
    pmid_elem = medline.find("PMID")
    pmid = pmid_elem.text if pmid_elem is not None else None
    
    # Title
    title_elem = article.find("ArticleTitle")
    title = "".join(title_elem.itertext()).strip() if title_elem is not None else ""
    # Remove trailing period if present
    title = title.rstrip(".")
    
    # Abstract
    abstract_parts = []
    abstract_elem = article.find("Abstract")
    if abstract_elem is not None:
        for text_elem in abstract_elem.findall("AbstractText"):
            label = text_elem.get("Label", "")
            text = "".join(text_elem.itertext()).strip()
            if label and text:
                abstract_parts.append(f"{label}: {text}")
            elif text:
                abstract_parts.append(text)
    abstract = " ".join(abstract_parts)
    
    # Authors (full list)
    authors = []
    author_list = article.find("AuthorList")
    if author_list is not None:
        for auth in author_list.findall("Author"):
            lastname = auth.findtext("LastName", "")
            initials = auth.findtext("Initials", "")
            if lastname and initials:
                authors.append(f"{lastname} {initials}")
            elif lastname:
                # Try ForeName
                forename = auth.findtext("ForeName", "")
                if forename:
                    # Convert "John Michael" to "JM"
                    inits = "".join(w[0] for w in forename.split() if w)
                    authors.append(f"{lastname} {inits}")
                else:
                    authors.append(lastname)
            else:
                # Collective author
                collective = auth.findtext("CollectiveName", "")
                if collective:
                    authors.append(collective)
    
    # Journal
    journal_elem = article.find("Journal")
    journal_title = ""
    year = None
    if journal_elem is not None:
        journal_title = journal_elem.findtext("Title", "")
        if not journal_title:
            journal_title = journal_elem.findtext("ISOAbbreviation", "")
        
        # Year
        pub_date = journal_elem.find("JournalIssue/PubDate")
        if pub_date is not None:
            year_text = pub_date.findtext("Year", "")
            if year_text:
                year = int(year_text)
    
    # Fallback year from MedlineDate
    if year is None:
        medline_date = journal_elem.find("JournalIssue/PubDate/MedlineDate") if journal_elem is not None else None
        if medline_date is not None and medline_date.text:
            match = re.search(r"(\d{4})", medline_date.text)
            if match:
                year = int(match.group(1))
    
    # Fallback year from ArticleDate
    if year is None:
        article_date = article.find("ArticleDate")
        if article_date is not None:
            year_text = article_date.findtext("Year", "")
            if year_text:
                year = int(year_text)
    
    # DOI
    doi = None
    for id_elem in article.findall("ELocationID"):
        if id_elem.get("EIdType") == "doi":
            doi = id_elem.text
    
    # Also check PubmedData/ArticleIdList
    if doi is None:
        pubmed_data = elem.find(".//PubmedData")
        if pubmed_data is not None:
            for aid in pubmed_data.findall("ArticleIdList/ArticleId"):
                if aid.get("IdType") == "doi":
                    doi = aid.text
    
    # Open Access status
    open_access = False
    pubmed_data = elem.find(".//PubmedData")
    if pubmed_data is not None:
        # Check for PMC ID (indicates free full text)
        for aid in pubmed_data.findall("ArticleIdList/ArticleId"):
            if aid.get("IdType") == "pmc":
                open_access = True
                break
    
    # MeSH terms and keywords
    mesh_terms = []
    for mesh in medline.findall(".//MeshHeadingList/MeshHeading/DescriptorName"):
        mesh_terms.append(mesh.text)
    
    keywords_list = []
    for kw in medline.findall(".//KeywordList/Keyword"):
        if kw.text:
            keywords_list.append(kw.text.lower())
    
    # Publication type
    pub_types = []
    for pt in article.findall("PublicationTypeList/PublicationType"):
        if pt.text:
            pub_types.append(pt.text)
    
    return {
        "pmid": pmid,
        "title": title,
        "abstract": abstract,
        "authors": authors,
        "journal": journal_title,
        "year": year,
        "doi": doi,
        "open_access": open_access,
        "mesh_terms": mesh_terms,
        "keywords_raw": keywords_list,
        "pub_types": pub_types,
    }


# ============================================================
# VALIDATION
# ============================================================

def check_relevance(article):
    """Check if article is actually about ayahuasca research.
    
    STRICT: At least one core term must appear in the TITLE.
    Abstract-only mentions are not enough — this filters out papers
    that only reference ayahuasca in passing.
    """
    title = article.get("title", "").lower()
    
    # Core terms that must appear in the title
    TITLE_REQUIRED_TERMS = [
        r"ayahuasca",
        r"banisteriopsis\s*caapi",
        r"\bdmt\b",
        r"\bharmine\b",
        r"\bharmaline\b",
        r"\bhoasca\b",
        r"santo\s*daime",
        r"uni[aã]o\s*do\s*vegetal",
        r"\budv\b",
        r"chacruna",
        r"psychotria\s*viridis",
    ]
    
    title_match = False
    for term in TITLE_REQUIRED_TERMS:
        if re.search(term, title, re.IGNORECASE):
            title_match = True
            break
    
    if not title_match:
        return False
    
    # If title matches, also verify broader relevance in title + abstract
    text = (title + " " + article.get("abstract", "")).lower()
    for term in RELEVANCE_TERMS:
        if re.search(term, text, re.IGNORECASE):
            return True
    
    # Also check MeSH terms
    mesh_text = " ".join(article.get("mesh_terms", [])).lower()
    for term in ["ayahuasca", "banisteriopsis", "n,n-dimethyltryptamine", "harmine"]:
        if term in mesh_text:
            return True
    
    return False


def validate_doi(doi):
    """Check that a DOI is properly formatted."""
    if not doi:
        return False
    # DOI format: 10.XXXX/something
    return bool(re.match(r"^10\.\d{4,}/\S+$", doi))


def validate_authors(authors):
    """Check that author list looks reasonable."""
    if not authors or len(authors) == 0:
        return False, "No authors"
    
    for auth in authors:
        # Each author should have at least a last name
        if len(auth.strip()) < 2:
            return False, f"Suspiciously short author name: '{auth}'"
    
    return True, "OK"


def validate_article(article, existing_dois, existing_pmids):
    """
    Comprehensive validation of a single article.
    Returns (is_valid, reason) tuple.
    """
    issues = []
    
    # 1. Must have PMID
    if not article.get("pmid"):
        return False, "No PMID"
    
    # 2. Check for duplicates
    if article["pmid"] in existing_pmids:
        return False, f"Duplicate PMID: {article['pmid']}"
    
    doi = article.get("doi", "")
    if doi and doi in existing_dois:
        return False, f"Duplicate DOI: {doi}"
    
    # 3. Must have title
    if not article.get("title") or len(article["title"]) < 10:
        return False, "Missing or too-short title"
    
    # 4. Must be relevant to ayahuasca
    if not check_relevance(article):
        return False, "Not relevant to ayahuasca (no matching terms in title/abstract)"
    
    # 5. Must have abstract (with some exceptions for letters/comments)
    if not article.get("abstract") or len(article["abstract"]) < 50:
        pub_types = [pt.lower() for pt in article.get("pub_types", [])]
        is_short_form = any(t in pt for pt in pub_types for t in ["letter", "comment", "editorial", "erratum", "correction"])
        if not is_short_form:
            issues.append("Short or missing abstract")
    
    # 6. Must have authors
    auth_valid, auth_msg = validate_authors(article.get("authors", []))
    if not auth_valid:
        return False, f"Author validation failed: {auth_msg}"
    
    # 7. Must have journal
    if not article.get("journal"):
        return False, "No journal name"
    
    # 8. Must have year
    if not article.get("year") or article["year"] < 1990 or article["year"] > datetime.now().year + 1:
        return False, f"Invalid year: {article.get('year')}"
    
    # 9. DOI should be valid format (if present)
    if doi and not validate_doi(doi):
        issues.append(f"Invalid DOI format: {doi}")
    
    # 10. Skip retractions
    pub_types = [pt.lower() for pt in article.get("pub_types", [])]
    if any("retract" in pt for pt in pub_types):
        return False, "Retracted article"
    
    # 11. Skip errata/corrections (they reference other papers)
    if any(pt in ["published erratum", "correction"] for pt in pub_types):
        return False, "Erratum/correction (not original research)"
    
    if issues:
        log.warning(f"  PMID {article['pmid']}: Minor issues: {'; '.join(issues)}")
    
    return True, "OK"


# ============================================================
# CATEGORY & TYPE ASSIGNMENT
# ============================================================

def assign_category(article):
    """Assign research category based on title + abstract keywords."""
    text = (article.get("title", "") + " " + article.get("abstract", "")).lower()
    
    for category, patterns in CATEGORY_RULES:
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return category
    
    return "Psychology"  # Default fallback


def assign_study_type(article):
    """Detect study type from title, abstract, and publication types."""
    text = (article.get("title", "") + " " + article.get("abstract", "")).lower()
    pub_types = " ".join(article.get("pub_types", [])).lower()
    combined = text + " " + pub_types
    
    for study_type, patterns in STUDY_TYPE_RULES:
        for pattern in patterns:
            if re.search(pattern, combined, re.IGNORECASE):
                return study_type
    
    # Fallback based on PubMed publication types
    if "review" in pub_types:
        return "Narrative review"
    if "clinical trial" in pub_types:
        return "Clinical trial"
    if "observational study" in pub_types:
        return "Prospective observational"
    
    return "Cross-sectional survey"  # Safe default


def extract_keywords(article, max_keywords=4):
    """Extract relevant keywords for the article."""
    # Start with PubMed keywords
    raw = article.get("keywords_raw", [])
    
    # If no keywords, extract from MeSH terms
    if not raw:
        raw = [m.lower() for m in article.get("mesh_terms", [])]
    
    # Filter to keep relevant, short keywords
    keywords = []
    seen = set()
    for kw in raw:
        kw = kw.strip().lower()
        if kw not in seen and len(kw) < 40 and len(kw) > 2:
            keywords.append(kw)
            seen.add(kw)
        if len(keywords) >= max_keywords:
            break
    
    # Fallback: extract from title
    if len(keywords) < 2:
        title_lower = article.get("title", "").lower()
        fallback_terms = [
            "ayahuasca", "dmt", "depression", "anxiety", "ptsd",
            "addiction", "neuroimaging", "pharmacology", "safety",
            "mindfulness", "personality", "well-being", "grief",
            "ceremony", "ritual", "indigenous", "harmine",
            "serotonin", "neuroplasticity", "psychotherapy"
        ]
        for term in fallback_terms:
            if term in title_lower and term not in seen:
                keywords.append(term)
                seen.add(term)
            if len(keywords) >= max_keywords:
                break
    
    return keywords[:max_keywords]


# ============================================================
# ARTICLES.JS FILE OPERATIONS
# ============================================================

def read_existing_articles(filepath):
    """Read current articles.js and extract existing DOIs, PMIDs, and max ID."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract DOIs
    dois = set(re.findall(r'doi:"([^"]+)"', content))
    
    # Extract PMIDs
    pmids = set(re.findall(r'pmid:"([^"]+)"', content))
    
    # Extract max ID
    ids = [int(m) for m in re.findall(r'id:(\d+)', content)]
    max_id = max(ids) if ids else 0
    
    # Count existing
    count = len(ids)
    
    return {
        "dois": dois,
        "pmids": pmids,
        "max_id": max_id,
        "count": count,
        "content": content,
    }


def format_article_entry(article, entry_id):
    """Format a validated article into the articles.js entry format."""
    # Escape quotes in strings
    def esc(s):
        return s.replace('"', '\\"').replace('\n', ' ').strip()
    
    title = esc(article["title"])
    authors = ",".join(f'"{esc(a)}"' for a in article["authors"])
    journal = esc(article["journal"])
    doi_str = f', doi:"{esc(article["doi"])}"' if article.get("doi") else ""
    pmid_str = f', pmid:"{article["pmid"]}"' if article.get("pmid") else ""
    category = article.get("_category", "Psychology")
    study_type = article.get("_study_type", "Cross-sectional survey")
    oa = "true" if article.get("open_access") else "false"
    
    # Truncate abstract to ~300 chars for the database
    abstract = esc(article.get("abstract", ""))
    if len(abstract) > 350:
        abstract = abstract[:347] + "..."
    
    keywords = ",".join(f'"{esc(k)}"' for k in article.get("_keywords", []))
    
    entry = (
        f'  {{ id:{entry_id}, title:"{title}", '
        f'authors:[{authors}], '
        f'journal:"{journal}", year:{article["year"]}'
        f'{doi_str}{pmid_str}, '
        f'category:"{category}", studyType:"{study_type}", '
        f'openAccess:{oa}, citations:0, '
        f'abstract:"{abstract}", '
        f'keywords:[{keywords}], '
        f'verification:"PubMed-Auto" }}'
    )
    
    return entry


def append_to_articles_js(filepath, new_entries, existing_data):
    """Append new entries to articles.js and update header."""
    content = existing_data["content"]
    new_count = existing_data["count"] + len(new_entries)
    today = datetime.now().strftime("%B %d, %Y")
    
    # Build the entries text
    entries_text = ",\n".join(new_entries)
    
    # Insert before the closing ];
    # Find the last entry and the closing bracket
    closing_bracket = content.rfind("];")
    if closing_bracket == -1:
        closing_bracket = content.rfind("]")
    
    if closing_bracket == -1:
        log.error("Could not find closing bracket in articles.js")
        return False
    
    # Check if the last character before ] is a comma or whitespace
    before_bracket = content[:closing_bracket].rstrip()
    if not before_bracket.endswith(","):
        entries_text = ",\n" + entries_text
    else:
        entries_text = "\n" + entries_text
    
    new_content = content[:closing_bracket] + entries_text + "\n" + content[closing_bracket:]
    
    # Update header comments
    new_content = re.sub(
        r"// Total articles: \d+",
        f"// Total articles: {new_count}",
        new_content
    )
    new_content = re.sub(
        r"// Total: \d+ peer-reviewed articles",
        f"// Total: {new_count} peer-reviewed articles",
        new_content
    )
    new_content = re.sub(
        r"// Audit date:.*",
        f"// Audit date: {today} (auto-ingestion)",
        new_content
    )
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    # Update public/stats.json for dynamic OG image
    stats_path = os.path.join(os.path.dirname(filepath), "..", "public", "stats.json")
    stats_path = os.path.normpath(stats_path)
    if os.path.exists(os.path.dirname(stats_path)):
        import json as json_mod
        min_year = 1972
        max_year = datetime.now().year
        stats_data = {
            "total": new_count,
            "yearRange": f"{min_year}-{max_year}",
            "lastUpdated": today
        }
        with open(stats_path, "w", encoding="utf-8") as sf:
            json_mod.dump(stats_data, sf, indent=2)
            sf.write("\n")
        log.info(f"Updated stats.json: {new_count} articles")
    
    # Regenerate OG image with updated count
    try:
        og_script = os.path.join(os.path.dirname(filepath), "..", "scripts", "generate-og.py")
        og_script = os.path.normpath(og_script)
        if os.path.exists(og_script):
            import subprocess
            subprocess.run(["python3", og_script], check=True)
            log.info("Regenerated OG image")
    except Exception as e:
        log.warning(f"Could not regenerate OG image: {e}")
    
    return True


# ============================================================
# DIGEST & NEWSLETTER
# ============================================================

def generate_digest(new_articles, existing_count):
    """Generate a newsletter digest of newly added articles."""
    today = datetime.now().strftime("%B %d, %Y")
    total = existing_count + len(new_articles)
    
    # Markdown version (for the digest file)
    md = f"# Ayahuasca Research Portal — New Articles\n"
    md += f"**{today}** · {len(new_articles)} new article{'s' if len(new_articles) != 1 else ''} added · {total} total in database\n\n"
    md += "---\n\n"
    
    for art in new_articles:
        first_author = art["authors"][0] if art["authors"] else "Unknown"
        et_al = " et al." if len(art["authors"]) > 2 else ""
        doi_link = f"https://doi.org/{art['doi']}" if art.get("doi") else ""
        pubmed_link = f"https://pubmed.ncbi.nlm.nih.gov/{art['pmid']}/" if art.get("pmid") else ""
        
        md += f"### {art['title']}\n"
        md += f"**{first_author}{et_al}** · *{art['journal']}* ({art['year']})\n\n"
        
        # Truncated abstract
        abstract = art.get("abstract", "")
        if len(abstract) > 250:
            abstract = abstract[:247] + "..."
        md += f"{abstract}\n\n"
        
        links = []
        if pubmed_link:
            links.append(f"[PubMed]({pubmed_link})")
        if doi_link:
            links.append(f"[Full text]({doi_link})")
        if links:
            md += " · ".join(links) + "\n"
        md += f"\n**Category:** {art.get('_category', 'N/A')} · **Type:** {art.get('_study_type', 'N/A')}\n\n"
        md += "---\n\n"
    
    # HTML version for Buttondown
    html = f"""<h2>🌿 Ayahuasca Research Portal — New Articles</h2>
<p><strong>{today}</strong> · {len(new_articles)} new article{'s' if len(new_articles) != 1 else ''} added · {total} total in database</p>
<hr>
"""
    
    for art in new_articles:
        first_author = art["authors"][0] if art["authors"] else "Unknown"
        et_al = " et al." if len(art["authors"]) > 2 else ""
        doi_link = f"https://doi.org/{art['doi']}" if art.get("doi") else "#"
        
        abstract = art.get("abstract", "")
        if len(abstract) > 250:
            abstract = abstract[:247] + "..."
        
        html += f"""
<div style="margin-bottom: 24px; padding: 16px; border-left: 3px solid #4ade80;">
  <h3 style="margin: 0 0 8px 0;"><a href="{doi_link}" style="color: #166534; text-decoration: none;">{art['title']}</a></h3>
  <p style="margin: 0 0 8px 0; color: #666;"><strong>{first_author}{et_al}</strong> · <em>{art['journal']}</em> ({art['year']})</p>
  <p style="margin: 0 0 8px 0; font-size: 14px;">{abstract}</p>
  <p style="margin: 0; font-size: 13px; color: #888;">📂 {art.get('_category', 'N/A')} · 🔬 {art.get('_study_type', 'N/A')}</p>
</div>
"""
    
    html += """
<hr>
<p style="font-size: 13px; color: #888;">
  This digest is auto-generated by the <a href="https://ayahuasca-research.org">Ayahuasca Research Portal</a>.
  New peer-reviewed articles are added every two weeks from PubMed.
</p>
"""
    
    return md, html


def send_buttondown_newsletter(subject, html_body, api_key):
    """Send newsletter via Buttondown API."""
    if not api_key:
        log.warning("No Buttondown API key — skipping newsletter send")
        return False
    
    payload = json.dumps({
        "subject": subject,
        "body": html_body,
        "status": "about_to_send",  # Automatically sends to all subscribers
    }).encode("utf-8")
    
    req = Request(
        BUTTONDOWN_API,
        data=payload,
        headers={
            "Authorization": f"Token {api_key}",
            "Content-Type": "application/json",
        },
        method="POST"
    )
    
    try:
        with urlopen(req, timeout=30) as resp:
            if resp.status in (200, 201):
                log.info("✅ Newsletter draft created in Buttondown")
                return True
            else:
                log.error(f"Buttondown API returned status {resp.status}")
                return False
    except Exception as e:
        log.error(f"Failed to send to Buttondown: {e}")
        return False


# ============================================================
# MAIN PIPELINE
# ============================================================

def generate_slug(title):
    """Generate a URL-safe slug from a title."""
    import unicodedata
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug[:80].rstrip('-')


def insert_to_supabase(articles, supabase_url, supabase_key):
    """Insert validated articles directly into Supabase, skipping duplicates."""
    if not supabase_url or not supabase_key:
        log.warning("Supabase credentials not set, skipping database insert")
        return 0

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates",
    }

    inserted = 0
    for art in articles:
        slug = generate_slug(art["title"])
        row = {
            "title": art["title"],
            "slug": slug,
            "authors": art.get("authors", []),
            "journal": art.get("journal", ""),
            "year": art.get("year", 0),
            "doi": art.get("doi"),
            "pmid": art.get("pmid"),
            "abstract": art.get("abstract", ""),
            "category": art.get("_category", "Psychology"),
            "tags": art.get("_keywords", []),
            "citations": 0,
            "verification": "PubMed-Auto",
            "study_type": art.get("_study_type"),
            "open_access": art.get("open_access", False),
        }

        try:
            data = json.dumps(row).encode("utf-8")
            url = f"{supabase_url}/rest/v1/articles"
            req = Request(url, data=data, headers=headers, method="POST")
            with urlopen(req, timeout=15) as resp:
                if resp.status in (200, 201):
                    inserted += 1
                    log.info(f"  📦 Supabase: inserted '{art['title'][:50]}...'")
        except HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            if "duplicate" in body.lower() or e.code == 409:
                log.info(f"  ⏭️  Supabase: duplicate skipped (DOI: {art.get('doi', 'N/A')})")
            else:
                log.error(f"  ❌ Supabase insert failed ({e.code}): {body[:200]}")
        except Exception as e:
            log.error(f"  ❌ Supabase insert error: {e}")

    return inserted


def run_ingestion(articles_path, days_back=15, dry_run=False, send_digest=False):
    """Main ingestion pipeline."""

    # Get API keys from environment
    pubmed_api_key = os.environ.get("PUBMED_API_KEY", "")
    buttondown_api_key = os.environ.get("BUTTONDOWN_API_KEY", "")
    supabase_url = os.environ.get("SUPABASE_URL", os.environ.get("NEXT_PUBLIC_SUPABASE_URL", ""))
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_SERVICE_ROLE_KEY", ""))
    
    # Step 1: Read existing database
    log.info("=" * 60)
    log.info("AYAHUASCA RESEARCH PORTAL — AUTO-INGESTION")
    log.info("=" * 60)
    
    existing = read_existing_articles(articles_path)
    log.info(f"Current database: {existing['count']} articles, max ID: {existing['max_id']}")
    log.info(f"Existing DOIs: {len(existing['dois'])} | Existing PMIDs: {len(existing['pmids'])}")
    
    # Step 2: Search PubMed across all queries
    all_pmids = set()
    for query in SEARCH_QUERIES:
        pmids = search_pubmed(query, days_back=days_back, api_key=pubmed_api_key)
        all_pmids.update(pmids)
        time.sleep(0.5)  # Rate limiting between searches
    
    # Remove PMIDs we already have
    new_pmids = all_pmids - existing["pmids"]
    log.info(f"\nTotal unique PMIDs found: {len(all_pmids)}")
    log.info(f"Already in database: {len(all_pmids - new_pmids)}")
    log.info(f"New candidates: {len(new_pmids)}")
    
    if not new_pmids:
        log.info("No new articles found. Done.")
        return []
    
    # Step 3: Fetch full records
    records = fetch_pubmed_records(list(new_pmids), api_key=pubmed_api_key)
    log.info(f"Fetched {len(records)} full records")
    
    # Step 4: Validate each article
    validated = []
    rejected = []
    
    for art in records:
        is_valid, reason = validate_article(art, existing["dois"], existing["pmids"])
        if is_valid:
            # Assign category, study type, keywords
            art["_category"] = assign_category(art)
            art["_study_type"] = assign_study_type(art)
            art["_keywords"] = extract_keywords(art)
            validated.append(art)
            log.info(f"  ✅ PMID {art['pmid']}: {art['title'][:60]}... → {art['_category']}")
        else:
            rejected.append((art.get("pmid", "?"), reason))
            log.info(f"  ❌ PMID {art.get('pmid', '?')}: {reason}")
    
    log.info(f"\nValidation results: {len(validated)} accepted, {len(rejected)} rejected")
    
    if not validated:
        log.info("No valid new articles to add. Done.")
        return []
    
    # Step 5: Format entries
    next_id = existing["max_id"] + 1
    new_entries = []
    for i, art in enumerate(validated):
        entry = format_article_entry(art, next_id + i)
        new_entries.append(entry)
    
    # Step 6: Preview or commit
    if dry_run:
        log.info("\n" + "=" * 60)
        log.info("DRY RUN — Would add these entries:")
        log.info("=" * 60)
        for entry in new_entries:
            log.info(f"\n{entry[:200]}...")
        return validated
    
    # Step 7: Write to articles.js (backup/fallback)
    log.info(f"\nAppending {len(new_entries)} entries to {articles_path}...")
    success = append_to_articles_js(articles_path, new_entries, existing)
    if success:
        log.info(f"✅ articles.js updated: {existing['count']} → {existing['count'] + len(new_entries)} articles")
    else:
        log.error("❌ Failed to update articles.js")

    # Step 7b: Insert into Supabase
    if supabase_url and supabase_key:
        log.info(f"\nInserting {len(validated)} articles into Supabase...")
        sb_count = insert_to_supabase(validated, supabase_url, supabase_key)
        log.info(f"✅ Supabase: {sb_count} articles inserted")
    else:
        log.info("ℹ️  Supabase credentials not set, skipping database insert")
    
    # Step 8: Generate digest
    digest_md, digest_html = generate_digest(validated, existing["count"])
    
    digest_path = os.path.join("scripts", "latest-digest.md")
    os.makedirs(os.path.dirname(digest_path), exist_ok=True)
    with open(digest_path, "w", encoding="utf-8") as f:
        f.write(digest_md)
    log.info(f"📝 Digest saved to {digest_path}")
    
    # Step 9: Send newsletter
    if send_digest and buttondown_api_key:
        today = datetime.now().strftime("%B %d, %Y")
        subject = f"🌿 {len(validated)} New Ayahuasca Research Papers — {today}"
        send_buttondown_newsletter(subject, digest_html, buttondown_api_key)
    
    # Step 10: Summary
    log.info("\n" + "=" * 60)
    log.info("INGESTION COMPLETE")
    log.info("=" * 60)
    log.info(f"New articles added: {len(validated)}")
    log.info(f"Articles rejected:  {len(rejected)}")
    log.info(f"Database total:     {existing['count'] + len(validated)}")
    
    for pmid, reason in rejected:
        log.info(f"  Rejected PMID {pmid}: {reason}")
    
    return validated


# ============================================================
# CLI
# ============================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ayahuasca Research Portal — Auto-Ingestion")
    parser.add_argument("--dry-run", action="store_true", help="Preview without making changes")
    parser.add_argument("--days", type=int, default=15, help="Look back N days (default: 15)")
    parser.add_argument("--send-digest", action="store_true", help="Send newsletter via Buttondown")
    parser.add_argument("--articles-path", default=None, help="Path to articles.js")
    
    args = parser.parse_args()
    
    # Auto-detect articles.js path
    if args.articles_path:
        path = args.articles_path
    else:
        # Try common locations
        candidates = [
            "data/articles.js",
            "src/data/articles.js",
            "src/components/articles.js",
            "articles.js",
        ]
        path = None
        for c in candidates:
            if os.path.exists(c):
                path = c
                break
        if not path:
            log.error("Could not find articles.js. Use --articles-path to specify.")
            sys.exit(1)
    
    results = run_ingestion(
        articles_path=path,
        days_back=args.days,
        dry_run=args.dry_run,
        send_digest=args.send_digest,
    )
    
    if not results and not args.dry_run:
        log.info("No new articles added this run.")
