# Article Data Schema

## Required Fields

Every article in the database MUST have all of these fields:

```javascript
{
  id: Number,              // Sequential integer, unique
  title: String,           // Exact title from PubMed/publisher (no author/year prefix!)
  authors: [String],       // Array of "Surname Initials" format, e.g. ["Palhano-Fontes F", "Barreto D"]
  journal: String,         // Full journal name (not abbreviation)
  year: Number,            // Publication year (4 digits)
  doi: String,             // Format: "10.XXXX/..." (no "https://doi.org/" prefix)
  pmid: String | null,     // PubMed ID as string, or omit if not indexed
  category: String,        // Must match a key in CATEGORIES object
  studyType: String,       // From approved vocabulary (see CATEGORY_RULES.md)
  participants: Number | null, // Sample size N, null for reviews/theoretical
  openAccess: Boolean,     // true if freely accessible
  citations: Number,       // Approximate citation count (update periodically)
  abstract: String,        // 1-3 sentence summary of key findings
  keywords: [String],      // 3-6 lowercase keywords
  verification: String     // "PubMed" | "DOI" | "Publisher"
}
```

## Field Validation Rules

### id
- Must be unique across entire database
- Must be sequential (no gaps preferred, but not required)
- When adding: use `Math.max(...articles.map(a => a.id)) + 1`

### title
- Copy EXACTLY from PubMed or publisher
- No author/year prefixes (e.g., NOT "Smith et al. 2020 - Title here")
- Preserve original capitalization
- Include subtitles after colon if present in original

### authors
- Format: `"Surname Initials"` (e.g., `"Palhano-Fontes F"`)
- Include ALL authors (no "et al." truncation in the array)
- Hyphenated surnames preserved: `"Galvao-Coelho NL"`
- Use the author list from PubMed, not from the PDF header

### journal
- Full name, not abbreviation
- "PLOS ONE" not "PLoS One" — match PubMed's casing
- "Scientific Reports" not "Sci Rep"

### year
- Use the year shown on PubMed as the publication year
- If online-first year differs from print year, use the earlier year

### doi
- No protocol prefix: `"10.1038/s41598-020-61169-x"` not `"https://doi.org/10.1038/s41598-020-61169-x"`
- Must resolve when prepended with `https://doi.org/`

### pmid
- String format: `"29903051"` not `29903051`
- If article is not in PubMed, omit the field entirely (don't set to null or empty string)

### verification
- `"PubMed"` — PMID confirmed, title/authors match PubMed
- `"DOI"` — No PMID, but DOI resolves and publisher page matches
- `"Publisher"` — No PMID or DOI resolution, but found on publisher website or Google Scholar

## Database File Structure

```javascript
// articles.js

export const CATEGORIES = {
  "Clinical Trials": { color: "#2563eb", label: "Clinical Trials & Therapeutic Research" },
  "Depression & Mood": { color: "#7c3aed", label: "Depression, Anxiety & Mood Disorders" },
  "Neuroscience": { color: "#059669", label: "Neuroscience & Neuroimaging" },
  "Pharmacology": { color: "#d97706", label: "Pharmacology, Chemistry & Safety" },
  "Addiction": { color: "#dc2626", label: "Addiction & Substance Use" },
  "Ethnobotany": { color: "#65a30d", label: "Ethnobotany, Anthropology & Policy" },
  "Psychology": { color: "#0891b2", label: "Psychology, Wellbeing & Cognition" },
  "Reviews": { color: "#6366f1", label: "Reviews & Meta-Analyses" },
  "Safety": { color: "#e11d48", label: "Safety, Adverse Effects & Toxicology" },
  "Grief & Trauma": { color: "#9333ea", label: "Grief, Trauma & PTSD" },
};

export const VERIFIED_ARTICLES = [
  // Articles grouped by category with comment headers:
  // === CLINICAL TRIALS ===
  // === DEPRESSION & MOOD ===
  // === NEUROSCIENCE ===
  // etc.
];
```

## Category Colors (for reference)

| Category | Hex | Visual |
|----------|-----|--------|
| Clinical Trials | #2563eb | Blue |
| Depression & Mood | #7c3aed | Purple |
| Neuroscience | #059669 | Green |
| Pharmacology | #d97706 | Amber |
| Addiction | #dc2626 | Red |
| Ethnobotany | #65a30d | Lime |
| Psychology | #0891b2 | Cyan |
| Reviews | #6366f1 | Indigo |
| Safety | #e11d48 | Rose |
| Grief & Trauma | #9333ea | Violet |
