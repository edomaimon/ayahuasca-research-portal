# Category Assignment Rules

## Decision Tree

When assigning a category to a verified article, walk through this decision tree:

```
1. Is the primary focus a CLINICAL INTERVENTION with patients?
   → Yes: "Clinical Trials"
   
2. Is the primary focus DEPRESSION, ANXIETY, or MOOD BIOMARKERS?
   → Yes: "Depression & Mood"
   
3. Is the primary focus BRAIN IMAGING or NEURAL MECHANISMS?
   → Yes: "Neuroscience"
   
4. Is the primary focus DRUG CHEMISTRY, RECEPTORS, or DOSE-RESPONSE?
   → Yes: "Pharmacology"
   
5. Is the primary focus SUBSTANCE USE DISORDERS or ADDICTION?
   → Yes: "Addiction"
   
6. Is the primary focus ADVERSE EFFECTS, TOXICITY, or DRUG SAFETY?
   → Yes: "Safety"
   
7. Is the primary focus GRIEF, BEREAVEMENT, PTSD, or TRAUMA?
   → Yes: "Grief & Trauma"
   
8. Is the primary focus TRADITIONAL USE, CULTURE, POLICY, or LAW?
   → Yes: "Ethnobotany"
   
9. Is the primary focus WELLBEING, PERSONALITY, COGNITION, or MINDFULNESS?
   → Yes: "Psychology"
   
10. Is it a REVIEW, META-ANALYSIS, or COMPREHENSIVE OVERVIEW?
    → Yes: "Reviews"
```

## Tie-Breaking Rules

- **RCT measuring depression** → "Clinical Trials" (method > topic)
- **Neuroimaging of depression patients** → "Neuroscience" (if imaging is the focus) or "Depression & Mood" (if depression outcomes are the focus)
- **Safety review** → "Reviews" (if comprehensive) or "Safety" (if focused on specific adverse effects)
- **Addiction + clinical trial** → "Addiction" (topic > method for non-depression clinical)
- **Pharmacology + neuroscience** → whichever is the PRIMARY research question

## Study Type Vocabulary

Use these exact strings for the `studyType` field:

| Study Type | Use When... |
|-----------|-------------|
| `Randomized Controlled Trial` | Random assignment to intervention/control |
| `Open-label trial` | Clinical trial without blinding |
| `Longitudinal observational` | Repeated measures over time, no intervention |
| `Cross-sectional survey` | Single timepoint, questionnaire-based |
| `Neuroimaging study` | fMRI, PET, SPECT, EEG as primary method |
| `Pharmacokinetic study` | PK/PD, blood levels, metabolism |
| `In vitro / animal study` | Cell culture or animal models |
| `Qualitative study` | Interviews, thematic analysis |
| `Case report` | Individual patient case |
| `Systematic review` | Systematic search + inclusion criteria |
| `Meta-analysis` | Quantitative synthesis of studies |
| `Narrative review` | Expert overview without systematic search |
| `Secondary analysis of RCT` | Reanalysis of data from a prior RCT |
| `Prospective cohort` | Following a group over time |
| `Retrospective cohort` | Looking back at a group's history |
| `Ethnographic study` | Fieldwork, participant observation |
