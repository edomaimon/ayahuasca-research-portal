'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAutocompleteSuggestions } from '@/lib/searchUtils';
import { SearchIcon } from './BotanicalElements';

export default function SearchAutocomplete({ search, setSearch, articles }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const wrapperRef = useRef(null);
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const suggestions = debouncedQuery.length >= 2
    ? getAutocompleteSuggestions(debouncedQuery, articles)
    : [];

  useEffect(() => {
    setHighlightIdx(-1);
    setIsOpen(suggestions.length > 0);
  }, [suggestions.length]);

  const handleSelect = useCallback((suggestion) => {
    if (suggestion.type === 'article') {
      router.push(`/articles/${suggestion.slug}`);
    } else {
      setSearch(suggestion.text);
    }
    setIsOpen(false);
  }, [router, setSearch]);

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Group suggestions by type for headers
  const groupLabels = { article: 'Articles', author: 'Authors', keyword: 'Keywords' };
  let lastType = null;

  return (
    <div className="search-autocomplete" ref={wrapperRef}>
      <div className="search-bar">
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search by title, author, journal, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <span className="search-bar__icon">
          <SearchIcon />
        </span>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="search-autocomplete__dropdown">
          {suggestions.map((s, idx) => {
            const showHeader = s.type !== lastType;
            lastType = s.type;
            return (
              <div key={idx}>
                {showHeader && (
                  <div className="search-autocomplete__group-label">
                    {groupLabels[s.type] || s.type}
                  </div>
                )}
                <div
                  className={`search-autocomplete__item ${idx === highlightIdx ? 'search-autocomplete__item--highlighted' : ''}`}
                  onMouseDown={() => handleSelect(s)}
                  onMouseEnter={() => setHighlightIdx(idx)}
                >
                  <HighlightMatch text={s.text} query={debouncedQuery} />
                  {s.type === 'article' && (
                    <span className="search-autocomplete__item-arrow">&rsaquo;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HighlightMatch({ text, query }) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span className="search-autocomplete__item-text">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="search-autocomplete__match">{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
