import { supabaseAdmin } from './supabase';

// Fallback: import static data for when Supabase is unavailable
import { VERIFIED_ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';

/**
 * Normalize a Supabase row to match the shape components expect.
 */
function normalizeArticle(row) {
  return {
    id: row.legacy_id || row.id,
    title: row.title,
    slug: row.slug,
    authors: row.authors || [],
    journal: row.journal,
    year: row.year,
    doi: row.doi,
    pmid: row.pmid,
    abstract: row.abstract,
    category: row.category,
    keywords: row.tags || [],
    citations: row.citations || 0,
    verification: row.verification,
    studyType: row.study_type,
    openAccess: row.open_access,
    participants: row.participants,
  };
}

/**
 * Fetch all articles with optional filters.
 */
export async function getAllArticles({
  category,
  search,
  tags,
  yearFrom,
  yearTo,
  studyType,
  openAccess,
  sortBy = 'newest',
  page = 1,
  limit = 500,
} = {}) {
  try {
    let query = supabaseAdmin
      .from('articles')
      .select('*');

    if (category) query = query.eq('category', category);
    if (studyType) query = query.eq('study_type', studyType);
    if (openAccess) query = query.eq('open_access', true);
    if (yearFrom) query = query.gte('year', yearFrom);
    if (yearTo) query = query.lte('year', yearTo);
    if (tags && tags.length > 0) query = query.contains('tags', tags);

    if (search) {
      query = query.textSearch('fts', search, { type: 'websearch' });
    }

    switch (sortBy) {
      case 'oldest':
        query = query.order('year', { ascending: true });
        break;
      case 'cited':
        query = query.order('citations', { ascending: false });
        break;
      case 'az':
        query = query.order('title', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('year', { ascending: false });
        break;
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(normalizeArticle);
  } catch (err) {
    console.error('getAllArticles failed, using static fallback:', err.message);
    return VERIFIED_ARTICLES;
  }
}

/**
 * Fetch a single article by slug.
 */
export async function getArticleBySlug(slug) {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data ? normalizeArticle(data) : null;
  } catch (err) {
    console.error('getArticleBySlug failed, using static fallback:', err.message);
    return VERIFIED_ARTICLES.find(a => a.slug === slug) || null;
  }
}

/**
 * Fetch related articles using scoring logic.
 */
export async function getRelatedArticles(article, limit = 4) {
  try {
    const articles = await getAllArticles();
    return articles
      .filter(a => a.id !== article.id)
      .map(a => {
        let score = 0;
        if (a.category === article.category) score += 3;
        if (article.keywords && a.keywords) {
          score += a.keywords.filter(k => article.keywords.includes(k)).length * 2;
        }
        if (a.journal === article.journal) score += 1;
        if (Math.abs(a.year - article.year) <= 2) score += 1;
        return { ...a, score };
      })
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get database statistics.
 */
export async function getArticleStats() {
  try {
    const articles = await getAllArticles();
    return {
      total: articles.length,
      openAccess: articles.filter(a => a.openAccess).length,
      totalCitations: articles.reduce((sum, a) => sum + (a.citations || 0), 0),
      journals: new Set(articles.map(a => a.journal)).size,
      yearRange: `${Math.min(...articles.map(a => a.year))}-${Math.max(...articles.map(a => a.year))}`,
      pubmedVerified: articles.filter(a => a.verification?.startsWith('PubMed')).length,
      categories: Object.keys(CATEGORIES).map(cat => ({
        name: cat,
        count: articles.filter(a => a.category === cat).length,
        ...CATEGORIES[cat],
      })),
    };
  } catch (err) {
    console.error('getArticleStats failed:', err.message);
    return null;
  }
}

/**
 * Get study type counts.
 */
export async function getStudyTypes() {
  try {
    const articles = await getAllArticles();
    const counts = {};
    articles.forEach(a => {
      if (a.studyType) counts[a.studyType] = (counts[a.studyType] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  } catch {
    return [];
  }
}

/**
 * Full-text search using the tsvector column.
 */
export async function searchArticles(query) {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .textSearch('fts', query, { type: 'websearch' })
      .order('year', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data || []).map(normalizeArticle);
  } catch (err) {
    console.error('searchArticles failed:', err.message);
    return [];
  }
}

/**
 * Get all unique slugs (for generateStaticParams).
 */
export async function getAllSlugs() {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('slug');
    if (error) throw error;
    return (data || []).map(r => r.slug);
  } catch {
    return VERIFIED_ARTICLES.map(a => a.slug);
  }
}
