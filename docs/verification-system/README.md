# Ayahuasca Research Portal — Article Verification System

## Overview

This system ensures every article in the Ayahuasca Research Portal is **real**, **accurate**, and **relevant**. It was built after a full database audit (Feb 21, 2026) uncovered 1 fabricated article, 2 metadata errors, and 3 missing PMIDs in a 67-article database.

## File Map

```
verification-system/
├── README.md                  ← You are here
├── SKILL.md                   ← MAIN REFERENCE: Complete verification protocol
├── CATEGORY_RULES.md          ← How to assign categories and study types
├── DATA_SCHEMA.md             ← Article object structure and field rules
├── VERIFICATION_CHECKLIST.md  ← Quick copy-paste checklists for single articles and audits
├── SEARCH_STRATEGY.md         ← How to find new articles to add
├── VERIFIED_REGISTRY.md       ← Master list of all 66 verified articles with PMIDs/DOIs
└── REJECTION_LOG.md           ← Every article removed or corrected, with evidence
```

## How to Use

### Adding a new article
1. Read `SKILL.md` → Phase 1-4
2. Fill out the checklist from `VERIFICATION_CHECKLIST.md`
3. Use `DATA_SCHEMA.md` to build the article object
4. Use `CATEGORY_RULES.md` to assign category and study type
5. Add to `VERIFIED_REGISTRY.md`

### Running a full audit
1. Read `SKILL.md` → "Full Database Audit" section
2. Use `VERIFIED_REGISTRY.md` as the cross-check reference
3. Follow the batch protocol in `VERIFICATION_CHECKLIST.md`
4. Log any corrections or removals in `REJECTION_LOG.md`
5. Update `VERIFIED_REGISTRY.md` with final counts

### Finding new articles
1. Read `SEARCH_STRATEGY.md` for search queries and gap analysis
2. Verify each candidate through `SKILL.md` Phase 1-3
3. Only add if it passes all phases

## Core Principles

1. **PubMed is gold standard.** Always try to find a PMID first.
2. **Cross-check PMIDs.** A PMID that points to the wrong paper is worse than no PMID.
3. **Authors are hallucination signals.** If the entire author list is wrong, the article may be fabricated.
4. **When in doubt, don't add.** It's better to have 60 verified articles than 70 with fakes.
5. **Document everything.** Every removal and correction goes in the rejection log with evidence.
6. **Verify before trusting.** Never trust an article's metadata without checking against the source.

## Audit History

| Date | Auditor | Articles Checked | Verified | Corrected | Removed | Final Count |
|------|---------|-----------------|----------|-----------|---------|-------------|
| 2026-02-20 | Claude | 70 | 67 | 0 | 3 | 67 |
| 2026-02-21 | Claude | 67 | 63 | 2 (+3 PMIDs) | 1 | 66 |
