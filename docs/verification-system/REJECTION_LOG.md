# Rejection & Correction Log

Records every article removed from or corrected in the database, with evidence.

---

## REMOVED ARTICLES

### 1. "Ayahuasca experience and self-compassion: Results of a preliminary online survey"
- **Listed authors:** Rush B, Marcus O, Garcia L
- **Listed journal:** Frontiers in Pharmacology (2021)
- **Listed DOI:** 10.3389/fphar.2021.720082
- **Reason:** FABRICATED
- **Evidence:**
  - DOI does not resolve (404 on doi.org)
  - Zero results for exact title in PubMed, Google Scholar, Frontiers
  - Author combination "Rush B, Marcus O, Garcia L" has no ayahuasca publications
  - No Frontiers article with that DOI number exists
- **Date removed:** 2026-02-21
- **Audit:** Full database audit v1

### 2. "Ayahuasca and the treatment of depression" (Dominguez-Clavé et al., 2016)
- **Listed DOI:** Unknown
- **Reason:** UNVERIFIABLE
- **Evidence:** Could not confirm existence via PubMed, DOI, or publisher search
- **Date removed:** 2026-02-20
- **Audit:** Initial verification pass

### 3. "Therapeutic applications of ayahuasca and DMT" (Dos Santos & Hallak, 2017)
- **Listed DOI:** Unknown
- **Reason:** UNVERIFIABLE
- **Evidence:** Specific paper not found; authors do have other verified publications in database
- **Date removed:** 2026-02-20
- **Audit:** Initial verification pass

### 4. "Ayahuasca and spiritual crisis" (Luna, 2011)
- **Listed DOI:** Unknown
- **Reason:** UNVERIFIABLE
- **Evidence:** Could not confirm existence in peer-reviewed literature
- **Date removed:** 2026-02-20
- **Audit:** Initial verification pass

---

## CORRECTED ARTICLES

### 1. Article 8 — Wrong PMID
- **Title:** "Changes in inflammatory biomarkers are related to the antidepressant effects of ayahuasca"
- **Error:** PMID listed as 32648493
- **What PMID 32648493 actually is:** "Endovascular treatment for cerebral venous sinus thrombosis" (Andersen et al., Br J Neurosurg 2021)
- **Correct PMID:** 32648790 (confirmed via DOI 10.1177/0269881120936486)
- **Date corrected:** 2026-02-21

### 2. Article 10 — Wrong Authors
- **Title:** "A quantitative textual analysis of the subjective effects of ayahuasca in naive users with and without depression"
- **Error:** Authors listed as "de Oliveira FL, Hallak JEC, Crippa JAS, dos Santos RG"
- **Correct authors:** Cruz L, Bienemann B, Palhano-Fontes F, Tófoli LF, Araújo DB, Mograbi DC
- **Verification:** PubMed PMID 37949934; DOI 10.1038/s41598-023-44193-5
- **Date corrected:** 2026-02-21

### 3. Article 15 — Missing PMID
- **Title:** "Subacute effects of the psychedelic ayahuasca on the salience and default mode networks"
- **Change:** Added PMID 32255395 (was DOI-only)
- **Date corrected:** 2026-02-21

### 4. Article 44 — Missing PMID
- **Title:** "Ayahuasca afterglow: Improved mindfulness and cognitive flexibility in ayahuasca drinkers"
- **Change:** Added PMID 31927605 (was DOI-only)
- **Date corrected:** 2026-02-21

### 5. Article 61 — Missing PMID
- **Title:** "Ayahuasca for grief therapy: Protocol for a proof-of-concept randomized controlled trial"
- **Change:** Added PMID 40890317 (was Publisher-only)
- **Date corrected:** 2026-02-21

### 6. Article 34 — Title formatting
- **Error:** Title had "Daldegan-Bueno et al. 2022 -" prefix
- **Date corrected:** 2026-02-21

### 7. Article 67 — Title formatting
- **Error:** Title had "Dos Santos et al. 2016 -" prefix
- **Date corrected:** 2026-02-21

---

## LOG TEMPLATE

When adding new entries, use this format:

```markdown
### [N]. "[Short title]" ([First author], [Year])
- **Listed [field]:** [what was in the database]
- **Reason:** [FABRICATED / UNVERIFIABLE / RETRACTED / PREDATORY / OFF-TOPIC / DUPLICATE]
- **Evidence:**
  - [Bullet point evidence 1]
  - [Bullet point evidence 2]
- **Date removed/corrected:** YYYY-MM-DD
- **Audit:** [which audit caught it]
```
