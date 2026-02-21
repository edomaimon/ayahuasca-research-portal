---
name: article-verification
description: Systematic verification of research article authenticity and relevance for the Ayahuasca Research Portal. Use whenever adding, auditing, or re-verifying articles in the database. Covers identity verification (is this paper real?), metadata accuracy (are the details correct?), and relevance filtering (does it belong in this portal?).
---

# Article Verification System for the Ayahuasca Research Portal

## Purpose

This system ensures every article in the Ayahuasca Research Portal database is:
1. **REAL** — published in a legitimate peer-reviewed venue
2. **ACCURATE** — all metadata (authors, PMID, DOI, year, journal) are correct
3. **RELEVANT** — directly pertains to ayahuasca or its core alkaloids (DMT, harmine, harmaline, THH) in a scientific research context

## When To Use This System

- Adding any new article to the database
- Performing periodic full-database audits
- Responding to user requests to verify articles
- After any automated or bulk import of articles

---

## PHASE 1: IDENTITY VERIFICATION (Is this paper real?)

### Tier 1 — PubMed PMID Confirmation (Gold Standard)

**Method:** Search PubMed for the article by title or PMID.

```
web_search: "PMID XXXXXXXX" 
  OR
web_search: "[exact title fragment]" pubmed [first author surname]
```

**PASS criteria — ALL must match:**
- [ ] PMID exists on pubmed.ncbi.nlm.nih.gov
- [ ] Title on PubMed matches the database title (minor formatting differences OK)
- [ ] First author surname matches
- [ ] Journal name matches
- [ ] Publication year matches (±1 year OK for online-first vs print)

**If PMID is provided but points to a DIFFERENT paper:** 
→ This is a CRITICAL ERROR. The PMID is wrong.
→ Search PubMed by title to find the correct PMID.
→ If the correct PMID is found, fix it. If the paper cannot be found on PubMed at all, escalate to Tier 2.

**If no PMID is provided:**
→ Search PubMed by title. If found, record the PMID and upgrade verification to "PubMed".

### Tier 2 — DOI Resolution

**Method:** Search for or fetch the DOI.

```
web_search: "DOI_STRING" [first author surname]
  OR  
web_fetch: https://doi.org/DOI_STRING
```

**PASS criteria:**
- [ ] DOI resolves to a publisher page (not a 404)
- [ ] Publisher page shows matching title, authors, journal, year
- [ ] The journal is identifiable as a legitimate peer-reviewed publication

### Tier 3 — Publisher / Direct Confirmation

**Method:** Search the publisher website or Google Scholar directly.

```
web_search: "[title fragment]" [journal name] [first author] [year]
```

**PASS criteria:**
- [ ] Article appears on the official journal/publisher website
- [ ] OR article appears in Google Scholar with matching metadata
- [ ] OR article is cited by other verified papers in the database

### Verification FAIL — Article Must Be Removed

An article FAILS verification and must be DELETED if:
- No PMID, no valid DOI, and no publisher page can be found
- The title/author combination produces zero results across all search engines
- The DOI does not resolve to any page
- The paper exists but in a predatory/non-peer-reviewed venue (see RELEVANCE below)

---

## PHASE 2: METADATA ACCURACY (Are the details correct?)

For every article that passes Phase 1, verify these fields:

### Required Fields Checklist

| Field | Verification Method | Common Errors |
|-------|-------------------|---------------|
| `title` | Must match PubMed/publisher exactly | Truncation, wrong subtitle |
| `authors` | First author + last author must match source | Completely wrong author lists (hallucinated) |
| `journal` | Must match PubMed/publisher | Abbreviation vs full name |
| `year` | Must match publication year | Online-first year vs print year |
| `doi` | Must resolve correctly | Typos, wrong prefix |
| `pmid` | Must point to THIS paper | Points to unrelated paper (critical) |
| `category` | Must match study content | See CATEGORY_RULES.md |
| `studyType` | Must match actual methodology | Calling observational an RCT |
| `participants` | Must match reported N | Wrong N, missing N |
| `openAccess` | Check if freely available | Changed status |

### PMID Cross-Check Protocol (Critical)

This is the single most important accuracy check. A wrong PMID silently links to an unrelated paper.

**Procedure:**
1. Search PubMed for the PMID
2. Read the TITLE returned by PubMed
3. Compare character-by-character with the database title
4. If they don't match → THE PMID IS WRONG
5. Search PubMed by the article title to find the correct PMID
6. If found, replace. If not found, downgrade verification to DOI or Publisher.

**Known past error:** Article 8 (Galvão-Coelho 2020) had PMID 32648493 which pointed to an endovascular treatment paper. Correct PMID was 32648790.

### Author Verification Protocol

Author errors are the second most common fabrication signal.

**Procedure:**
1. Check first author and last author against PubMed/publisher
2. If the ENTIRE author list is different from the source → HIGH FABRICATION RISK
3. Minor order differences or middle-name variations are OK
4. Adding "et al." in the database is fine; inventing authors is not

**Known past error:** Article 10 listed "de Oliveira FL, Hallak JEC, Crippa JAS, dos Santos RG" but real authors were "Cruz L, Bienemann B, Palhano-Fontes F, Tófoli LF, Araújo DB, Mograbi DC".

---

## PHASE 3: RELEVANCE FILTERING (Does it belong?)

### Inclusion Criteria (ALL must be met)

1. **Peer-reviewed:** Published in a journal indexed in PubMed, Scopus, Web of Science, or equivalent. Conference abstracts alone do not qualify.

2. **Ayahuasca-specific:** The paper must be primarily about ONE of:
   - Ayahuasca (the brew) — clinical, pharmacological, psychological, or cultural studies
   - N,N-DMT as it relates to ayahuasca pharmacology (not DMT in isolation unless directly relevant)
   - Harmine / harmaline / THH as ayahuasca alkaloids
   - Ayahuasca-inspired formulations (e.g., pharmahuasca, DMT + harmine combinations)

3. **Scientific merit:** Must present original data, systematic review, meta-analysis, or substantive theoretical framework. Opinion pieces and editorials do not qualify unless they present novel hypotheses with citations.

### Exclusion Criteria (ANY triggers removal)

- **Predatory journals:** Check against Beall's List patterns (fake editorial boards, rapid publication for fee, no peer review)
- **Non-peer-reviewed sources:** Heffter Review is acceptable as a historical exception; blog posts, news articles, conference abstracts are not
- **Purely recreational/trip reports:** Qualitative studies from research contexts are fine; forum posts or anecdotal collections are not
- **Tangential DMT research:** Studies about 5-MeO-DMT, synthetic DMT in isolation without ayahuasca context, or toad venom
- **Duplicate publications:** Same data published in multiple journals
- **Retracted papers:** Check PubMed retraction notices

### Category Assignment Rules

Assign the BEST-FIT category based on the PRIMARY focus of the paper:

| Category | Use When... |
|----------|-------------|
| Clinical Trials | RCTs, open-label trials, clinical feasibility studies with patient populations |
| Depression & Mood | Studies primarily examining depression, anxiety, or mood biomarkers |
| Neuroscience | Neuroimaging (fMRI, PET, SPECT, EEG), neural connectivity, brain structure |
| Pharmacology | PK/PD, receptor binding, alkaloid chemistry, dose-response, neurogenesis |
| Safety | Adverse effects, toxicology, drug interactions, contraindications |
| Addiction | Substance use disorders, smoking cessation, anti-addictive mechanisms |
| Ethnobotany | Traditional use, cultural context, policy, legal frameworks, globalization |
| Psychology | Wellbeing, personality, mindfulness, cognition, emotion processing |
| Reviews | Systematic reviews, meta-analyses, narrative reviews, comprehensive overviews |
| Grief & Trauma | Bereavement, PTSD, trauma processing, grief therapy |

**Tie-breaking:** If a paper spans two categories, assign the one representing the paper's PRIMARY research question. E.g., an RCT measuring depression scores → "Clinical Trials" even though it's about depression.

---

## PHASE 4: VERIFICATION EXECUTION PROTOCOL

### For Adding a Single New Article

```
STEP 1: Source Discovery
  - Where did this article come from? (citation in another paper, user suggestion, search)
  - Get the full title and at least one identifier (PMID, DOI, or author+year+journal)

STEP 2: Identity Verification (Phase 1)
  - Run Tier 1 (PubMed) search first
  - If not found, try Tier 2 (DOI)
  - If not found, try Tier 3 (Publisher/Scholar)
  - If ALL THREE FAIL → DO NOT ADD. Document in rejection log.

STEP 3: Metadata Extraction
  - Extract all required fields from the verified source (PubMed preferred)
  - Copy title exactly as it appears
  - Copy author list exactly as it appears
  - Record the PMID if available
  - Record the DOI
  - Note if open access

STEP 4: Relevance Check (Phase 3)
  - Does it meet ALL inclusion criteria?
  - Does it trigger ANY exclusion criteria?
  - Assign category and study type

STEP 5: Database Entry
  - Create the article object with all fields
  - Set verification field to highest tier achieved ("PubMed" > "DOI" > "Publisher")
  - Add to database in the appropriate section
```

### For Full Database Audit

```
STEP 1: Extract all PMIDs from the database
STEP 2: Batch-verify PMIDs via PubMed searches (groups of 5-10)
STEP 3: For each PMID, confirm title matches
STEP 4: For DOI-only articles, attempt to find PMIDs via title search
STEP 5: For Publisher-only articles, attempt to find PMIDs or DOIs
STEP 6: Flag any article that cannot be verified at any tier
STEP 7: Check for wrong PMIDs (PMID exists but title doesn't match)
STEP 8: Check for wrong authors (common hallucination pattern)
STEP 9: Generate audit report with: verified count, corrections, removals
```

---

## RED FLAGS — Signals of Fabrication

These patterns indicate an article may be hallucinated/fabricated:

1. **DOI doesn't resolve** — The DOI format looks valid but leads to a 404 or "not found" page
2. **Zero search results** — Searching the exact title in quotes returns nothing anywhere
3. **Author mismatch** — The author list is completely different from what PubMed shows
4. **Journal doesn't exist** — The journal name cannot be found in any database
5. **Too-perfect metadata** — Round citation counts (exactly 100, 200), suspiciously neat abstracts
6. **Anachronistic references** — Paper claims to be from 2020 but references 2023 studies
7. **PMID points elsewhere** — The PMID exists but links to a completely unrelated paper
8. **Duplicate DOI pattern** — DOI follows a valid journal's pattern but the specific article isn't there

### Historical Fabrication Log

| Article | Issue | Resolution |
|---------|-------|------------|
| "Ayahuasca experience and self-compassion" (Rush, Marcus, Garcia 2021) | DOI 10.3389/fphar.2021.720082 doesn't exist, zero search results | REMOVED — fabricated |
| Article 8 PMID 32648493 | Pointed to endovascular surgery paper | CORRECTED to PMID 32648790 |
| Article 10 authors | Listed wrong authors entirely | CORRECTED to Cruz L, Bienemann B, et al. |

---

## OUTPUT FORMAT

### Verification Report Template

For each article verified, produce a one-line summary:

```
[PASS/FAIL/CORRECTED] Article {id}: "{short title}" — {verification tier} — {notes}
```

Examples:
```
[PASS] Article 1: "Rapid antidepressant effects..." — PubMed (PMID 29903051) — All fields match
[CORRECTED] Article 8: "Changes in inflammatory biomarkers..." — PubMed — PMID fixed: 32648493→32648790
[FAIL] Article 45: "Ayahuasca experience and self-compassion..." — REMOVED — DOI does not exist, paper fabricated
```

### Final Audit Summary

```
VERIFICATION AUDIT SUMMARY
===========================
Date: [date]
Total articles checked: [N]
Passed: [N]
Corrected: [N] (detail each correction)
Removed: [N] (detail each removal)
New PMIDs found: [N]
Database integrity: [N]/[total] verified (XX%)
```

---

## QUICK REFERENCE: Search Query Patterns

**PubMed by PMID:**
```
web_search: pubmed [PMID]
```

**PubMed by title:**
```
web_search: [first 8-10 words of title] [first author surname] pubmed
```

**DOI resolution:**
```
web_search: "[DOI string]" [first author surname]
```

**General discovery:**
```
web_search: [first author] [year] ayahuasca [key topic word] [journal name]
```

**Finding missing papers in a research area:**
```
web_search: ayahuasca [topic] clinical trial [year range] PubMed
web_search: ayahuasca [topic] randomized controlled trial
web_search: ayahuasca [topic] systematic review [year]
```
