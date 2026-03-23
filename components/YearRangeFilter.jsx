'use client';

import { useMemo } from 'react';

export default function YearRangeFilter({ yearRange, setYearRange, articles }) {
  const { minYear, maxYear } = useMemo(() => {
    const years = articles.map(a => a.year);
    return { minYear: Math.min(...years), maxYear: Math.max(...years) };
  }, [articles]);

  const countInRange = useMemo(() => {
    const from = yearRange.from || minYear;
    const to = yearRange.to || maxYear;
    return articles.filter(a => a.year >= from && a.year <= to).length;
  }, [articles, yearRange, minYear, maxYear]);

  const hasFilter = yearRange.from || yearRange.to;

  return (
    <div className="year-range">
      <span className="year-range__label">Year:</span>
      <input
        type="number"
        className="year-range__input"
        placeholder={minYear}
        min={minYear}
        max={maxYear}
        value={yearRange.from || ''}
        onChange={(e) => setYearRange(prev => ({
          ...prev,
          from: e.target.value ? Number(e.target.value) : null,
        }))}
      />
      <span className="year-range__sep">&ndash;</span>
      <input
        type="number"
        className="year-range__input"
        placeholder={maxYear}
        min={minYear}
        max={maxYear}
        value={yearRange.to || ''}
        onChange={(e) => setYearRange(prev => ({
          ...prev,
          to: e.target.value ? Number(e.target.value) : null,
        }))}
      />
      {hasFilter && (
        <>
          <span className="year-range__count">({countInRange})</span>
          <button
            className="year-range__clear"
            onClick={() => setYearRange({ from: null, to: null })}
          >
            &times;
          </button>
        </>
      )}
    </div>
  );
}
