# Quick Verification Checklist

## Single Article Addition — Copy this checklist for each article

```
ARTICLE: _______________________________________________
SOURCE:  _______________________________________________

PHASE 1: IDENTITY
  [ ] PubMed search by title → PMID found: _________
  [ ] OR DOI resolves → Publisher page confirms: Y/N
  [ ] OR Publisher/Scholar search confirms existence: Y/N
  VERDICT: REAL / NOT FOUND (→ REJECT)

PHASE 2: METADATA ACCURACY
  [ ] Title matches PubMed/publisher exactly
  [ ] First author matches source
  [ ] Last author matches source
  [ ] Journal name matches source
  [ ] Year matches source (±1 for online-first OK)
  [ ] DOI resolves to this paper
  [ ] PMID points to THIS paper (not a different one!)
  [ ] Participant count matches paper's reported N
  VERDICT: ACCURATE / CORRECTIONS NEEDED (list below)
  Corrections: ________________________________________

PHASE 3: RELEVANCE
  [ ] Published in peer-reviewed journal (not predatory)
  [ ] Primarily about ayahuasca or its core alkaloids
  [ ] Presents original data, review, or substantive framework
  [ ] Not a duplicate of existing database entry
  [ ] Not retracted
  VERDICT: RELEVANT / REJECT (reason: _________________)

PHASE 4: CLASSIFICATION
  Category: ____________________________________________
  Study Type: __________________________________________
  Open Access: Y/N
  
FINAL: ADD / REJECT
Verification tier: PubMed / DOI / Publisher
```

## Full Audit — Batch Protocol

```
DATE: _______________
AUDITOR: Claude
STARTING COUNT: ___

STEP 1: Extract all article IDs and PMIDs
STEP 2: For each PMID, verify title match via PubMed
STEP 3: For DOI-only articles, search PubMed for PMIDs
STEP 4: For Publisher-only articles, search for PMIDs/DOIs
STEP 5: Flag mismatches (wrong PMID, wrong authors)
STEP 6: Flag unverifiable articles
STEP 7: Generate corrections
STEP 8: Generate removals
STEP 9: Update database
STEP 10: Write audit report

RESULTS:
  Verified:   ___
  Corrected:  ___ (list: ___________________________)
  Removed:    ___ (list: ___________________________)
  PMIDs added: ___
  Final count: ___
```
