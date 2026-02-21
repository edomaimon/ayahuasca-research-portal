import { useState, useMemo } from 'react';
import { VERIFIED_ARTICLES } from './data/articles';
import { CATEGORIES } from './data/categories';
import Hero from './components/Hero';
import SearchFilters from './components/SearchFilters';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import Footer from './components/Footer';
import { LeafDivider, leafPatternUrl } from './components/BotanicalElements';

// Import styles
import './styles/hero.css';
import './styles/cards.css';
import './styles/modal.css';
import './styles/responsive.css';

// ============================================================
// Compute Database Statistics
// ============================================================
function getStats() {
  const articles = VERIFIED_ARTICLES;
  return {
    total: articles.length,
    openAccess: articles.filter((a) => a.openAccess).length,
    totalCitations: articles.reduce((sum, a) => sum + (a.citations || 0), 0),
    journals: new Set(articles.map((a) => a.journal)).size,
    yearRange: `${Math.min(...articles.map((a) => a.year))}-${Math.max(...articles.map((a) => a.year))}`,
    pubmedVerified: articles.filter((a) => a.verification === 'PubMed').length,
    categories: Object.keys(CATEGORIES).map((cat) => ({
      name: cat,
      count: articles.filter((a) => a.category === cat).length,
      ...CATEGORIES[cat],
    })),
  };
}

// ============================================================
// Main App Component
// ============================================================
export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);

  const stats = useMemo(() => getStats(), []);

  const filteredArticles = useMemo(() => {
    let articles = [...VERIFIED_ARTICLES];

    // Text search
    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.authors?.some((au) => au.toLowerCase().includes(q)) ||
          a.journal.toLowerCase().includes(q) ||
          a.abstract?.toLowerCase().includes(q) ||
          a.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      articles = articles.filter((a) => a.category === selectedCategory);
    }

    // Open access filter
    if (openAccessOnly) {
      articles = articles.filter((a) => a.openAccess);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        articles.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        articles.sort((a, b) => a.year - b.year);
        break;
      case 'cited':
        articles.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        break;
      case 'az':
        articles.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return articles;
  }, [search, selectedCategory, sortBy, openAccessOnly]);

  return (
    <>
      {/* Hero Section */}
      <Hero stats={stats} />

      {/* Main Content with botanical background */}
      <main
        className="main-content"
        style={{ backgroundImage: leafPatternUrl }}
      >
        {/* Search & Filters */}
        <SearchFilters
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          openAccessOnly={openAccessOnly}
          setOpenAccessOnly={setOpenAccessOnly}
          filteredCount={filteredArticles.length}
          categories={stats.categories}
        />

        {/* Article Grid */}
        <div className="grid-wrapper">
          <div className="article-grid">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={setSelectedArticle}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="no-results">
              <LeafDivider />
              <div className="no-results__title">No articles found</div>
              <div className="no-results__text">
                Try adjusting your search terms or filters
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer pubmedVerified={stats.pubmedVerified} />

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}
