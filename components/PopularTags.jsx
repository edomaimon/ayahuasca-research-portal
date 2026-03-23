'use client';

import { useMemo } from 'react';
import { computePopularTags } from '@/lib/searchUtils';

export default function PopularTags({ articles, selectedTags, setSelectedTags }) {
  const popularTags = useMemo(
    () => computePopularTags(articles, 20),
    [articles]
  );

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (popularTags.length === 0) return null;

  return (
    <div className="popular-tags">
      <span className="popular-tags__label">Topics:</span>
      {popularTags.map(({ tag, count }) => {
        const active = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            className={`popular-tags__chip ${active ? 'popular-tags__chip--active' : ''}`}
            onClick={() => toggleTag(tag)}
            title={`${count} articles`}
          >
            {tag}
            {active && (
              <span
                className="popular-tags__chip-x"
                onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}
              >
                &times;
              </span>
            )}
          </button>
        );
      })}
      {selectedTags.length > 0 && (
        <button
          className="popular-tags__clear"
          onClick={() => setSelectedTags([])}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
