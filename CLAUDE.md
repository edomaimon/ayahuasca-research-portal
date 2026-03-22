# Ayahuasca Research Portal

## What This Is
A curated collection of verified peer-reviewed articles on ayahuasca research (1972-2026). Currently a React + Vite single-page app deployed on Vercel via GitHub.

## Current Tech Stack
- React + Vite (migrating to Next.js)
- Static article data in src/data/articles.js (~150 articles)
- CSS files in src/styles/
- Buttondown newsletter integration
- PubMed auto-ingest via GitHub Actions (scripts/ingest.py)
- Deployed on Vercel, repo managed with GitHub Desktop

## Key Components
- Hero.jsx: video background hero with iOS autoplay fix (useRef + muted + touch/scroll fallback)
- SearchFilters.jsx: category pills, text search, study type, sort, open access toggle
- ArticleCard.jsx: article cards with category color accent and verification badge
- ArticleDetail.jsx: detail modal with full abstract, tags, related articles
- AboutSection.jsx, Subscribe.jsx (Buttondown), Footer.jsx

## Design Aesthetic
Earth tones, botanical theme, dark green (#1a2a1c) hero, warm cream (#f7f5f0) background, subtle leaf pattern SVG. Fonts: Inter for body. Clean, minimal, academic feel.

## Important Details
- OG image is og-image.jpg (not PNG) with explicit og:image:type meta tag
- Hero video is from Coverr CDN, requires muted+playsinline for iOS
- PubMed ingest filters require "ayahuasca" in article title (not just abstract) for relevance
- Vercel deployment is connected to the GitHub repo; pushing to main triggers deploy

## Current Goal
Migrating from Vite to Next.js App Router, then adding individual article pages, SEO, database (Supabase), and enhanced search/discovery features.
