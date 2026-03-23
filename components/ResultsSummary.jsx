'use client';

import { useMemo } from 'react';
import { findDidYouMean } from '@/lib/searchUtils';

export default function ResultsSummary({
  search,
  filteredCount,
  totalCount,
  selectedCategory,
  selectedTags,
  yearRange,
  openAccessOnly,
  articles,
  setSearch,
}) {
  const suggestions = useMemo(
    () => (filteredCount === 0 && search ? findDidYouMean(search, articles) : []),
    [filteredCount, search, articles]
  );

  // Build active filters description
  const filterParts = [];
  if (selectedCategory) filterParts.push(`in ${selectedCategory}`);
  if (selectedTags.length > 0) filterParts.push(`tagged "${selectedTags.join('", "')}"`);
  if (yearRange.from || yearRange.to) {
    const from = yearRange.from || 'start';
    const to = yearRange.to || 'present';
    filterParts.push(`${from}–${to}`);
  }
  if (openAccessOnly) filterParts.push('open access only');

  return (
    <div className="results-summary">
      {filteredCount > 0 ? (
        <span>
          {search ? (
            <>
              <strong>{filteredCount}</strong> result{filteredCount !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </>
          ) : (
            <>
              Showing <strong>{filteredCount}</strong> of {totalCount} articles
            </>
          )}
          {filterParts.length > 0 && (
            <span className="results-summary__filters">
              {' '}{filterParts.join(', ')}
            </span>
          )}
        </span>
      ) : (
        <div>
          <span>No articles found</span>
          {filterParts.length > 0 && (
            <span className="results-summary__filters">
              {' '}{filterParts.join(', ')}
            </span>
          )}
          {suggestions.length > 0 && (
            <div className="results-summary__suggestion">
              Did you mean:{' '}
              {suggestions.map((s, i) => (
                <span key={s}>
                  {i > 0 && ' or '}
                  <button
                    className="results-summary__suggestion-link"
                    onClick={() => setSearch(s)}
                  >
                    {s}
                  </button>
                </span>
              ))}
              ?
            </div>
          )}
        </div>
      )}
    </div>
  );
}
