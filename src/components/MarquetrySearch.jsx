import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';
import { MarquetryText, MarquetryIcon, MarquetryBand, WOOD } from './marquetry';
import '../styles/Marquetry.css';

const MarquetrySearch = ({ isVisible, toggleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { items, isLoading } = useSearchableData();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible && inputRef.current) inputRef.current.focus();
  }, [isVisible]);

  useEffect(() => {
    if (searchTerm) {
      const results = filterItems(
        items.filter((item) => item.type !== 'command'),
        searchTerm,
      ).slice(0, 8);
      setSearchResults(results);
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        toggleSearch?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVisible, toggleSearch]);

  if (!isVisible) return null;

  return (
    <div
      ref={searchRef}
      className="mqt-chrome mqt-wool-bark w-full relative z-50"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-2xl mx-auto py-4 px-4"
      >
        <div className="flex items-center gap-3">
          <label htmlFor="mqt-search-input" className="shrink-0">
            <MarquetryIcon name="search" fg={WOOD.gold} />
            <span className="sr-only">Find</span>
          </label>
          <div className="relative flex-1">
            <input
              id="mqt-search-input"
              ref={inputRef}
              type="text"
              placeholder={
                isLoading ? 'Opening the index…' : 'Search the codex…'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              className="mqt-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <MarquetryIcon name="close" fg={WOOD.rust} />
              </button>
            )}
          </div>
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div
            className="mqt-modal absolute mt-3 left-4 right-4 z-[100]"
            style={{ maxWidth: 'none', maxHeight: '60vh' }}
          >
            <MarquetryBand pattern="peerie" />
            <ol className="list-none m-0 p-3 overflow-y-auto">
              {searchResults.map((result, index) => (
                <li key={`${result.slug || result.commandId}-${index}`}>
                  <Link
                    to={result.path || '/'}
                    onClick={() => {
                      setSearchTerm('');
                      setIsDropdownOpen(false);
                      if (toggleSearch) toggleSearch();
                    }}
                    className="mqt-row !mb-2"
                  >
                    <div className="mqt-row-body">
                      <span className="mqt-search-result-title">
                        {result.title}
                      </span>
                      {result.description && (
                        <p className="mqt-muted text-sm truncate mt-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <span className="mqt-tag shrink-0">{result.type}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="flex items-center justify-between px-4 py-2 mqt-wool-bark">
              <span className="mqt-label">
                {searchResults.length}{' '}
                {searchResults.length === 1 ? 'entry' : 'entries'} found
              </span>
              <MarquetryText
                text="Marquetry lookup"
                size="small"
                fg={WOOD.wheat}
                fit
              />
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="mqt-patch absolute mt-3 left-4 right-4 z-[100] text-center">
            <p className="m-0 font-bold">No results for “{searchTerm}”</p>
            <p className="mqt-muted m-0 mt-1 text-sm">
              Try a different word or a shorter search.
            </p>
          </div>
        )}
      </form>
      <MarquetryBand
        pattern="zigzag"
        colors={{ bg: WOOD.bark, fg: WOOD.gold }}
      />
    </div>
  );
};

export default MarquetrySearch;
