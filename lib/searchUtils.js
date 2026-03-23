/**
 * Compute the top N most common keywords across all articles.
 */
export function computePopularTags(articles, limit = 20) {
  const counts = {};
  articles.forEach(a => {
    (a.keywords || []).forEach(k => {
      counts[k] = (counts[k] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

/**
 * Score an article's relevance to a search query.
 * Higher = more relevant. Title matches rank highest.
 */
export function scoreRelevance(article, query) {
  if (!query) return 0;
  const q = query.toLowerCase();
  let score = 0;
  const title = article.title.toLowerCase();
  if (title.startsWith(q)) score += 15;
  else if (title.includes(q)) score += 10;
  if (article.keywords?.some(k => k.toLowerCase() === q)) score += 8;
  if (article.keywords?.some(k => k.toLowerCase().includes(q))) score += 4;
  if (article.authors?.some(au => au.toLowerCase().includes(q))) score += 5;
  if (article.journal.toLowerCase().includes(q)) score += 3;
  if (article.abstract?.toLowerCase().includes(q)) score += 1;
  return score;
}

/**
 * Simple Levenshtein distance between two strings.
 */
export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    prev = curr;
  }
  return prev[n];
}

/**
 * Find "did you mean?" suggestions for a failed search query.
 */
export function findDidYouMean(query, articles, limit = 2) {
  if (!query || query.length < 3) return [];
  const q = query.toLowerCase();

  // Collect candidate terms: keywords, categories, common words from titles
  const candidates = new Set();
  articles.forEach(a => {
    (a.keywords || []).forEach(k => candidates.add(k.toLowerCase()));
    candidates.add(a.category.toLowerCase());
  });

  return [...candidates]
    .map(term => ({ term, dist: levenshtein(q, term) }))
    .filter(({ dist, term }) => dist > 0 && dist <= Math.max(2, Math.floor(term.length / 3)))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(({ term }) => term);
}

/**
 * Generate autocomplete suggestions grouped by type.
 */
export function getAutocompleteSuggestions(query, articles, limit = 8) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];
  const seen = new Set();

  // Articles (title matches)
  for (const a of articles) {
    if (results.length >= limit) break;
    if (a.title.toLowerCase().includes(q)) {
      results.push({ type: 'article', text: a.title, slug: a.slug });
      seen.add('article:' + a.slug);
    }
    if (results.length >= 4) break; // Cap articles at 4
  }

  // Authors
  const authorSet = new Set();
  for (const a of articles) {
    for (const au of (a.authors || [])) {
      if (au.toLowerCase().includes(q) && !authorSet.has(au)) {
        authorSet.add(au);
        if (results.length < limit) {
          results.push({ type: 'author', text: au });
        }
      }
    }
    if (authorSet.size >= 2) break; // Cap authors at 2
  }

  // Keywords
  const tagSet = new Set();
  for (const a of articles) {
    for (const k of (a.keywords || [])) {
      if (k.toLowerCase().includes(q) && !tagSet.has(k)) {
        tagSet.add(k);
        if (results.length < limit) {
          results.push({ type: 'keyword', text: k });
        }
      }
    }
    if (tagSet.size >= 2) break; // Cap keywords at 2
  }

  return results.slice(0, limit);
}
