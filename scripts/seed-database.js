#!/usr/bin/env node
/**
 * Seed Supabase database from the static articles.js file.
 *
 * Usage:
 *   node scripts/seed-database.js
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * in .env.local or environment variables.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load env from .env.local ────────────────────────────────
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    });
  } catch {
    // .env.local not found — rely on existing env vars
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ── Generate slug ───────────────────────────────────────────
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
    .replace(/-$/, '');
}

// ── Load articles from articles.js ──────────────────────────
async function loadArticles() {
  const articlesPath = join(__dirname, '..', 'data', 'articles.js');
  const mod = await import(articlesPath);
  return mod.VERIFIED_ARTICLES || mod.default;
}

// ── Seed ────────────────────────────────────────────────────
async function seed() {
  console.log('Loading articles from data/articles.js...');
  const articles = await loadArticles();
  console.log(`Found ${articles.length} articles`);

  // Build slug set for dedup
  const slugSet = new Set();

  const rows = articles.map(a => {
    let slug = a.slug || generateSlug(a.title);
    if (slugSet.has(slug)) slug = `${slug}-${a.id}`;
    slugSet.add(slug);

    return {
      legacy_id: a.id,
      title: a.title,
      slug,
      authors: a.authors || [],
      journal: a.journal,
      year: a.year,
      doi: a.doi || null,
      pmid: a.pmid || null,
      abstract: a.abstract || null,
      category: a.category,
      tags: a.keywords || [],
      citations: a.citations || 0,
      verification: a.verification || 'DOI',
      study_type: a.studyType || null,
      open_access: a.openAccess || false,
      participants: a.participants || null,
    };
  });

  console.log('Inserting into Supabase...');

  let success = 0;
  let failed = 0;

  // Insert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase
      .from('articles')
      .upsert(batch, { onConflict: 'slug' });

    if (error) {
      console.error(`Batch ${i / 50 + 1} failed:`, error.message);
      failed += batch.length;
    } else {
      success += batch.length;
      console.log(`  Batch ${Math.floor(i / 50) + 1}: ${batch.length} articles inserted`);
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
