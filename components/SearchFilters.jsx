'use client';

import { useState } from 'react';
import CategoryPill from './CategoryPill';
import SearchAutocomplete from './SearchAutocomplete';
import PopularTags from './PopularTags';
import YearRangeFilter from './YearRangeFilter';
import ResultsSummary from './ResultsSummary';
import FilterDrawer, { FilterDrawerTrigger } from './FilterDrawer';

export default function SearchFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedStudyType,
  setSelectedStudyType,
  studyTypes,
  sortBy,
  setSortBy,
  openAccessOnly,
  setOpenAccessOnly,
  filteredCount,
  totalCount,
  categories,
  articles,
  selectedTags,
  setSelectedTags,
  yearRange,
  setYearRange,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedStudyType ? 1 : 0) +
    (openAccessOnly ? 1 : 0) +
    selectedTags.length +
    (yearRange.from || yearRange.to ? 1 : 0);

  return (
    <div className="search-section">
      {/* Section Header */}
      <div className="search-section__header">
        <h2 className="search-section__title">Research Library</h2>
        <p className="search-section__subtitle">
          Browse, search, and filter the complete database of verified scientific literature
        </p>
      </div>

      {/* Sticky search bar on mobile */}
      <div className="search-section__search-row">
        <SearchAutocomplete
          search={search}
          setSearch={setSearch}
          articles={articles}
        />
        {/* Mobile filter trigger */}
        <div className="search-section__mobile-trigger">
          <FilterDrawerTrigger
            onClick={() => setDrawerOpen(true)}
            activeCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Desktop filters — hidden on mobile */}
      <div className="search-section__desktop-filters">
        {/* Popular Tags */}
        <PopularTags
          articles={articles}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />

        {/* Category Filter Pills */}
        <div className="filter-row">
          <CategoryPill
            name="All"
            color="var(--color-primary)"
            count={totalCount}
            active={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
          />
          {categories
            .filter((c) => c.count > 0)
            .map((c) => (
              <CategoryPill
                key={c.name}
                name={c.name}
                color={c.color}
                count={c.count}
                active={selectedCategory === c.name}
                onClick={() =>
                  setSelectedCategory(selectedCategory === c.name ? null : c.name)
                }
              />
            ))}
        </div>

        {/* Sort, Study Type, Year Range & Open Access Controls */}
        <div className="controls-row">
          <ResultsSummary
            search={search}
            filteredCount={filteredCount}
            totalCount={totalCount}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            yearRange={yearRange}
            openAccessOnly={openAccessOnly}
            articles={articles}
            setSearch={setSearch}
          />
          <div className="controls-row__right">
            <YearRangeFilter
              yearRange={yearRange}
              setYearRange={setYearRange}
              articles={articles}
            />
            <select
              className="controls-row__select"
              value={selectedStudyType || ''}
              onChange={(e) => setSelectedStudyType(e.target.value || null)}
            >
              <option value="">All Study Types</option>
              {studyTypes.map((st) => (
                <option key={st.name} value={st.name}>
                  {st.name} ({st.count})
                </option>
              ))}
            </select>
            <label className="controls-row__checkbox">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
              />
              Open Access only
            </label>
            <select
              className="controls-row__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {search && <option value="relevance">Relevance</option>}
              <option value="recent">Recently Added</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="cited">Most cited</option>
              <option value="az">A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile results count */}
      <div className="search-section__mobile-count">
        Showing <strong>{filteredCount}</strong> of {totalCount} articles
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStudyType={selectedStudyType}
        setSelectedStudyType={setSelectedStudyType}
        studyTypes={studyTypes}
        sortBy={sortBy}
        setSortBy={setSortBy}
        openAccessOnly={openAccessOnly}
        setOpenAccessOnly={setOpenAccessOnly}
        totalCount={totalCount}
        categories={categories}
        articles={articles}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        yearRange={yearRange}
        setYearRange={setYearRange}
        search={search}
      />
    </div>
  );
}
