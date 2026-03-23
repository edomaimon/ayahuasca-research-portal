'use client';

import CategoryPill from './CategoryPill';
import SearchAutocomplete from './SearchAutocomplete';
import PopularTags from './PopularTags';
import YearRangeFilter from './YearRangeFilter';
import ResultsSummary from './ResultsSummary';

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
  return (
    <div className="search-section">
      {/* Section Header */}
      <div className="search-section__header">
        <h2 className="search-section__title">Research Library</h2>
        <p className="search-section__subtitle">
          Browse, search, and filter the complete database of verified scientific literature
        </p>
      </div>

      {/* Search Bar with Autocomplete */}
      <SearchAutocomplete
        search={search}
        setSearch={setSearch}
        articles={articles}
      />

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
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="cited">Most cited</option>
            <option value="az">A to Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
