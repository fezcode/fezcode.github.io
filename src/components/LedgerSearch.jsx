import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';
import '../styles/Ledger.css';

/**
 * Ledger theme search — a lookup slip laid over the top of the book.
 * The query is written on a ruled input line; matches come back as an
 * invert-on-hover index, each entry ranked, dotted-leadered to its
 * classification, and tallied in the closing strip.
 */
const LedgerSearch = ({ isVisible, toggleSearch }) => {
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
      const results = filterItems(items, searchTerm).slice(0, 8);
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
      className="ldg-chrome w-full py-5 px-6 relative z-50"
      style={{
        backgroundColor: 'var(--ldg-veil)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid var(--ldg-rule)',
      }}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="flex items-baseline gap-3">
          <label htmlFor="ldg-search-input" className="ldg-eyebrow shrink-0">
            LOOKUP
          </label>
          <div className="relative flex-1">
            <input
              id="ldg-search-input"
              ref={inputRef}
              type="text"
              placeholder={
                isLoading ? 'BINDING THE INDEX…' : 'SEARCH THE LEDGER…'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              className="ldg-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="ldg-btn absolute right-2 top-1/2 -translate-y-1/2"
                style={{ padding: '1px 6px' }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div
            className="ldg-modal absolute mt-3 w-full left-0 z-[100]"
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
                    className="ldg-row-link"
                  >
                    <span className="ldg-rank">
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
                          className="ldg-muted block truncate normal-case"
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
                    <span className="ldg-leader" aria-hidden="true" />
                    <span className="ldg-badge">{result.type}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <div
              className="flex items-baseline justify-between px-4 py-2"
              style={{ borderTop: '1px solid var(--ldg-rule)' }}
            >
              <span className="ldg-stats">
                <span>
                  <strong>
                    {String(searchResults.length).padStart(2, '0')}
                  </strong>{' '}
                  {searchResults.length === 1 ? 'ENTRY' : 'ENTRIES'} FOUND
                </span>
              </span>
              <span className="ldg-label">LEDGER LOOKUP</span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div
            className="ldg-modal absolute mt-3 w-full left-0 z-[100] p-6 text-center"
            style={{ maxWidth: 'none' }}
          >
            <p className="ldg-label m-0">
              NO ENTRY FILED UNDER{' '}
              <span className="ldg-accent">“{searchTerm}”</span>
            </p>
            <p className="ldg-label m-0 mt-2" style={{ opacity: 0.7 }}>
              CHECK THE SPELLING, OR FILE IT YOURSELF
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LedgerSearch;
