# Auto-Ingestion Setup Guide

Everything you need to set up automatic article ingestion + newsletter.
Total time: ~15 minutes.

---

## Step 1 · Get a Free PubMed API Key (5 min)

1. Go to **https://www.ncbi.nlm.nih.gov/account/**
2. Click **Log in** (create an NCBI account if you don't have one — it's free, just needs an email)
3. Once logged in, go to **https://www.ncbi.nlm.nih.gov/account/settings/**
4. Scroll down to **API Key Management**
5. Click **Create an API Key**
6. **Copy the key** — you'll need it in Step 3

> The PubMed API key gives you 10 requests/second instead of 3. Free, no credit card.

---

## Step 2 · Create a Buttondown Newsletter Account (5 min)

1. Go to **https://buttondown.com/register**
2. Sign up with your email (free plan = up to 100 subscribers)
3. Choose a username — this becomes your newsletter URL (e.g., `buttondown.com/ayahuasca-research`)
4. Go to **Settings → API** (https://buttondown.com/settings/api)
5. **Copy your API key**
6. Go to **Settings → Basics** and set:
   - Newsletter name: `Ayahuasca Research Portal`
   - Description: `New peer-reviewed ayahuasca research papers, delivered every two weeks`

> Later you can customize your newsletter branding, add a logo, etc.

---

## Step 3 · Add Secrets to Your GitHub Repository (3 min)

1. Go to your GitHub repository page
2. Click **Settings** (tab at the top)
3. In the left sidebar, click **Secrets and variables → Actions**
4. Click **New repository secret** and add these two:

| Name | Value |
|---|---|
| `PUBMED_API_KEY` | The key you copied in Step 1 |
| `BUTTONDOWN_API_KEY` | The key you copied in Step 2 |

> These are encrypted — nobody can see them, not even collaborators.

---

## Step 4 · Add the Files to Your Repository (2 min)

Copy these files into your repo:

```
your-repo/
├── scripts/
│   └── ingest.py              ← The ingestion script
├── .github/
│   └── workflows/
│       └── auto-ingest.yml    ← The GitHub Action
└── src/
    └── components/
        └── Subscribe.jsx      ← Newsletter subscribe widget
```

Then in `Subscribe.jsx`, replace `YOUR_BUTTONDOWN_USERNAME` with your actual Buttondown username.

Commit and push:
```
git add scripts/ .github/ src/components/Subscribe.jsx
git commit -m "Add auto-ingestion pipeline and newsletter"
git push
```

---

## Step 5 · Test It (1 min)

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. In the left sidebar, click **Auto-Ingest New Articles**
4. Click **Run workflow** (dropdown on the right)
5. Set **Dry run** to `true` for the first test
6. Click **Run workflow**

Watch the logs — you'll see it search PubMed, find papers, validate them, and show what would be added. No changes are made in dry-run mode.

When you're happy, run it again with dry-run set to `false`.

---

## Step 6 · Add the Subscribe Widget to Your Site

Import the component wherever you want it:

```jsx
import Subscribe from './components/Subscribe';

// In your page or footer:
<Subscribe />
```

---

## How It Works After Setup

**Every 2 weeks (1st and 15th of the month at 06:00 UTC):**

1. GitHub Action fires automatically
2. Python script queries PubMed for new ayahuasca papers
3. Each paper is validated:
   - PMID exists and resolves
   - DOI format is valid
   - Title or abstract contains ayahuasca-related terms
   - Has complete author list
   - Has journal name and year
   - Has an abstract (for original research)
   - Not a retraction, erratum, or duplicate
4. Valid papers are assigned a category and study type
5. They're appended to `articles.js`
6. A newsletter digest is created and sent to Buttondown
7. Changes are committed and pushed to GitHub
8. Vercel auto-deploys the updated site

**You don't need to do anything.** But you'll get the newsletter too, so you always know what was added.

---

## Manual Controls

You can always trigger the workflow manually from the Actions tab:

- **Dry run**: Preview what would be added without making changes
- **Days back**: Look further back than 15 days (useful if you missed a cycle)
- **Send digest**: Toggle newsletter on/off

You can also run the script locally:
```bash
# Preview what would be added (no changes)
python scripts/ingest.py --dry-run --days 30

# Actually run it
PUBMED_API_KEY=your_key python scripts/ingest.py --days 30 --send-digest
```

---

## Validation Safeguards

The script will **reject** papers that:
- Don't mention ayahuasca (or related terms) in title or abstract
- Are duplicates of existing entries (by PMID or DOI)
- Are retractions or errata
- Have no authors, no journal, or no year
- Have an invalid or future year
- Have a malformed DOI

Papers are tagged with `verification: "PubMed-Auto"` so you can always tell which entries were added automatically vs. manually verified.

---

## If Something Goes Wrong

- Check the **Actions** tab on GitHub for error logs
- The script never deletes existing articles — worst case, bad entries get added (tagged as "PubMed-Auto" so easy to find and remove)
- You can always revert by rolling back the git commit
- Run `--dry-run` anytime to preview without risk
