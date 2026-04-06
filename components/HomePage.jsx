'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Hero from './Hero';
import FeaturedArticles from './FeaturedArticles';
import StatsBar from './StatsBar';
import SearchFilters from './SearchFilters';
import ArticleCard from './ArticleCard';
import LazyCard from './LazyCard';
import Pagination from './Pagination';
import SkeletonCard from './SkeletonCard';
import Footer from './Footer';
import AboutSection from './AboutSection';
import Subscribe from './Subscribe';
import { LeafDivider, leafPatternUrl } from './BotanicalElements';
import { scoreRelevance } from '@/lib/searchUtils';

const PAGE_SIZE = 24;

export default function HomePage({ articles, stats, studyTypes, initialSearch, featuredArticles, uniqueAuthors }) {
  const [search, setSearch] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStudyType, setSelectedStudyType] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [yearRange, setYearRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const gridRef = useRef(null);

  // Auto-switch to relevance sort when search is active
  useEffect(() => {
    if (search) {
      setSortBy('relevance');
    } else {
      setSortBy(prev => prev === 'relevance' ? 'newest' : prev);
    }
  }, [search]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedStudyType, sortBy, openAccessOnly, selectedTags, yearRange]);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

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

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (selectedStudyType) {
      result = result.filter((a) => a.studyType === selectedStudyType);
    }

    if (openAccessOnly) {
      result = result.filter((a) => a.openAccess);
    }

    if (selectedTags.length > 0) {
      result = result.filter((a) =>
        selectedTags.every(tag =>
          a.keywords?.some(k => k.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    if (yearRange.from) {
      result = result.filter((a) => a.year >= yearRange.from);
    }
    if (yearRange.to) {
      result = result.filter((a) => a.year <= yearRange.to);
    }

    switch (sortBy) {
      case 'relevance':
        if (search) {
          result.sort((a, b) => {
            const diff = scoreRelevance(b, search) - scoreRelevance(a, search);
            return diff !== 0 ? diff : b.year - a.year;
          });
        } else {
          result.sort((a, b) => b.year - a.year);
        }
        break;
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
  }, [articles, search, selectedCategory, selectedStudyType, sortBy, openAccessOnly, selectedTags, yearRange]);

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = useCallback((page) => {
    setIsPageTransition(true);
    setCurrentPage(page);

    // Scroll to top of grid
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Brief loading state for visual feedback
    setTimeout(() => setIsPageTransition(false), 150);
  }, []);

  return (
    <>
      <Hero stats={stats} />

      {/* Featured Articles */}
      <FeaturedArticles articles={featuredArticles} />

      {/* Stats Overview */}
      <StatsBar stats={stats} uniqueAuthors={uniqueAuthors} />

      <main
        className="main-content"
        style={{ backgroundImage: leafPatternUrl }}
      >
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
          articles={articles}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          yearRange={yearRange}
          setYearRange={setYearRange}
        />

        <div className="grid-wrapper" ref={gridRef}>
          {isPageTransition ? (
            <div className="article-grid">
              {Array.from({ length: Math.min(PAGE_SIZE, filteredArticles.length) }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="article-grid">
              {paginatedArticles.map((article, i) => (
                <LazyCard key={article.id} index={i}>
                  <ArticleCard
                    article={article}
                    searchQuery={search}
                  />
                </LazyCard>
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && !isPageTransition && (
            <div className="no-results">
              <LeafDivider />
              <div className="no-results__title">No articles found</div>
              <div className="no-results__text">
                Try adjusting your search terms or filters
              </div>
              <div className="no-results__suggestions">
                {search && (
                  <button
                    className="no-results__filter-btn"
                    onClick={() => setSearch('')}
                  >
                    Clear search &ldquo;{search}&rdquo;
                  </button>
                )}
                {selectedCategory && (
                  <button
                    className="no-results__filter-btn"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Remove &ldquo;{selectedCategory}&rdquo; filter
                  </button>
                )}
                {selectedStudyType && (
                  <button
                    className="no-results__filter-btn"
                    onClick={() => setSelectedStudyType(null)}
                  >
                    Remove &ldquo;{selectedStudyType}&rdquo; filter
                  </button>
                )}
                {openAccessOnly && (
                  <button
                    className="no-results__filter-btn"
                    onClick={() => setOpenAccessOnly(false)}
                  >
                    Remove Open Access filter
                  </button>
                )}
                {selectedTags.length > 0 && (
                  <button
                    className="no-results__filter-btn"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear all tags
                  </button>
                )}
                {(yearRange.from || yearRange.to) && (
                  <button
                    className="no-results__filter-btn"
                    onClick={() => setYearRange({ from: null, to: null })}
                  >
                    Clear year range
                  </button>
                )}
              </div>
              {(search || selectedCategory || selectedStudyType || openAccessOnly || selectedTags.length > 0 || yearRange.from || yearRange.to) && (
                <button
                  className="no-results__clear-all"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory(null);
                    setSelectedStudyType(null);
                    setOpenAccessOnly(false);
                    setSelectedTags([]);
                    setYearRange({ from: null, to: null });
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredArticles.length}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <AboutSection />
      <Subscribe />
      <Footer pubmedVerified={stats.pubmedVerified} />
    </>
  );
}
