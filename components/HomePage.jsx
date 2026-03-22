'use client';

import { useState, useMemo } from 'react';
import Hero from './Hero';
import SearchFilters from './SearchFilters';
import ArticleCard from './ArticleCard';
import ArticleDetail from './ArticleDetail';
import Footer from './Footer';
import AboutSection from './AboutSection';
import Subscribe from './Subscribe';
import { LeafDivider, leafPatternUrl } from './BotanicalElements';

export default function HomePage({ articles, stats, studyTypes }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStudyType, setSelectedStudyType] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Text search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
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
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Study type filter
    if (selectedStudyType) {
      result = result.filter((a) => a.studyType === selectedStudyType);
    }

    // Open access filter
    if (openAccessOnly) {
      result = result.filter((a) => a.openAccess);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'cited':
        result.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [articles, search, selectedCategory, selectedStudyType, sortBy, openAccessOnly]);

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
          selectedStudyType={selectedStudyType}
          setSelectedStudyType={setSelectedStudyType}
          studyTypes={studyTypes}
          sortBy={sortBy}
          setSortBy={setSortBy}
          openAccessOnly={openAccessOnly}
          setOpenAccessOnly={setOpenAccessOnly}
          filteredCount={filteredArticles.length}
          totalCount={articles.length}
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

      {/* About Section */}
      <AboutSection />

      {/* Newsletter Subscription */}
      <Subscribe />

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
