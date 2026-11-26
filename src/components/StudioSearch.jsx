import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';
import '../styles/Studio.css';

const StudioSearch = ({ isVisible, toggleSearch }) => {
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

  const getResultLink = (result) => result.path || '/';

  if (!isVisible) return null;

  return (
    <div
      ref={searchRef}
      className="std-chrome w-full py-5 px-6 relative z-50"
      style={{
        backgroundColor: 'var(--std-veil)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid var(--std-rule)',
      }}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="flex items-baseline gap-3">
          <label htmlFor="std-search-input" className="std-eyebrow shrink-0">
            Find
          </label>
          <div className="relative flex-1">
            <input
              id="std-search-input"
              ref={inputRef}
              type="text"
              placeholder={
                isLoading ? 'Opening the index…' : 'Search the codex…'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              className="std-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="std-btn absolute right-2 top-1/2 -translate-y-1/2"
                style={{ padding: '1px 6px' }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div
            className="std-modal absolute mt-3 w-full left-0 z-[100]"
            style={{ maxWidth: 'none', maxHeight: '60vh' }}
          >
            <ol className="list-none m-0 p-2 flex flex-col gap-[2px] overflow-y-auto">
              {searchResults.map((result, index) => (
                <li key={`${result.slug || result.commandId}-${index}`}>
                  <Link
                    to={getResultLink(result)}
                    onClick={() => {
                      setSearchTerm('');
                      setIsDropdownOpen(false);
                      if (toggleSearch) toggleSearch();
                    }}
                    className="std-row-link"
                  >
                    <span className="std-rank">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block font-bold truncate"
                        style={{ letterSpacing: '1px' }}
                      >
                        {result.title}
                      </span>
                      {result.description && (
                        <span
                          className="std-muted block truncate normal-case"
                          style={{
                            fontSize: '0.74rem',
                            letterSpacing: 0,
                            textTransform: 'none',
                          }}
                        >
                          {result.description}
                        </span>
                      )}
                    </span>
                    <span className="std-leader" aria-hidden="true" />
                    <span className="std-badge">{result.type}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <div
              className="flex items-baseline justify-between px-4 py-2"
              style={{ borderTop: '1px solid var(--std-rule)' }}
            >
              <span className="std-stats">
                <span>
                  <strong>
                    {String(searchResults.length).padStart(2, '0')}
                  </strong>{' '}
                  {searchResults.length === 1 ? 'ENTRY' : 'ENTRIES'} FOUND
                </span>
              </span>
              <span className="std-label">Studio search</span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div
            className="std-modal absolute mt-3 w-full left-0 z-[100] p-6 text-center"
            style={{ maxWidth: 'none' }}
          >
            <p className="std-label m-0">
              No results for <span className="std-accent">“{searchTerm}”</span>
            </p>
            <p className="std-label m-0 mt-2" style={{ opacity: 0.7 }}>
              Try a different word or a shorter search.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudioSearch;
