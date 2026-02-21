import { VERIFIED_ARTICLES } from '../data/articles';
import CategoryPill from './CategoryPill';
import { SearchIcon } from './BotanicalElements';

// ============================================================
// Search & Filter Controls Component
// ============================================================

export default function SearchFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  openAccessOnly,
  setOpenAccessOnly,
  filteredCount,
  categories,
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

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search by title, author, journal, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-bar__icon">
          <SearchIcon />
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="filter-row">
        <CategoryPill
          name="All"
          color="var(--color-primary)"
          count={VERIFIED_ARTICLES.length}
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

      {/* Sort & Open Access Controls */}
      <div className="controls-row">
        <div className="controls-row__count">
          Showing <strong>{filteredCount}</strong> of {VERIFIED_ARTICLES.length} articles
        </div>
        <div className="controls-row__right">
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
