'use client';

import { useEffect } from 'react';
import CategoryPill from './CategoryPill';
import PopularTags from './PopularTags';
import YearRangeFilter from './YearRangeFilter';

export default function FilterDrawer({
  open,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedStudyType,
  setSelectedStudyType,
  studyTypes,
  sortBy,
  setSortBy,
  openAccessOnly,
  setOpenAccessOnly,
  totalCount,
  categories,
  articles,
  selectedTags,
  setSelectedTags,
  yearRange,
  setYearRange,
  search,
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const activeCount =
    (selectedCategory ? 1 : 0) +
    (selectedStudyType ? 1 : 0) +
    (openAccessOnly ? 1 : 0) +
    selectedTags.length +
    (yearRange.from || yearRange.to ? 1 : 0);

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedStudyType(null);
    setOpenAccessOnly(false);
    setSelectedTags([]);
    setYearRange({ from: null, to: null });
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="filter-drawer__backdrop" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`filter-drawer ${open ? 'filter-drawer--open' : ''}`}>
        <div className="filter-drawer__header">
          <h3 className="filter-drawer__title">Filters</h3>
          <button className="filter-drawer__close" onClick={onClose} aria-label="Close filters">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="filter-drawer__body">
          {/* Categories */}
          <div className="filter-drawer__section">
            <div className="filter-drawer__section-label">Category</div>
            <div className="filter-drawer__pills">
              <CategoryPill
                name="All"
                color="var(--color-primary)"
                count={totalCount}
                active={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              />
              {categories
                .filter(c => c.count > 0)
                .map(c => (
                  <CategoryPill
                    key={c.name}
                    name={c.name}
                    color={c.color}
                    count={c.count}
                    active={selectedCategory === c.name}
                    onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)}
                  />
                ))}
            </div>
          </div>

          {/* Tags */}
          <div className="filter-drawer__section">
            <div className="filter-drawer__section-label">Topics</div>
            <PopularTags
              articles={articles}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          {/* Study Type */}
          <div className="filter-drawer__section">
            <div className="filter-drawer__section-label">Study Type</div>
            <select
              className="controls-row__select filter-drawer__select"
              value={selectedStudyType || ''}
              onChange={(e) => setSelectedStudyType(e.target.value || null)}
            >
              <option value="">All Study Types</option>
              {studyTypes.map(st => (
                <option key={st.name} value={st.name}>{st.name} ({st.count})</option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div className="filter-drawer__section">
            <div className="filter-drawer__section-label">Year Range</div>
            <YearRangeFilter
              yearRange={yearRange}
              setYearRange={setYearRange}
              articles={articles}
            />
          </div>

          {/* Sort */}
          <div className="filter-drawer__section">
            <div className="filter-drawer__section-label">Sort By</div>
            <select
              className="controls-row__select filter-drawer__select"
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

          {/* Open Access */}
          <div className="filter-drawer__section">
            <label className="controls-row__checkbox">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
              />
              Open Access only
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="filter-drawer__footer">
          {activeCount > 0 && (
            <button className="filter-drawer__clear" onClick={handleClearAll}>
              Clear All
            </button>
          )}
          <button className="filter-drawer__apply" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Trigger button for opening the filter drawer.
 */
export function FilterDrawerTrigger({ onClick, activeCount }) {
  return (
    <button className="filter-drawer-trigger" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
      Filters
      {activeCount > 0 && (
        <span className="filter-drawer-trigger__badge">{activeCount}</span>
      )}
    </button>
  );
}
