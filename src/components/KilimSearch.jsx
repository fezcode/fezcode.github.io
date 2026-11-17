import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';
import { KilimIcon, KilimBadge, KilimStripe, WOOL } from './kilim';
import '../styles/Kilim.css';
import '../styles/kilim-chrome.css';

const KilimSearch = ({ isVisible, toggleSearch }) => {
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

  if (!isVisible) return null;

  return (
    <div ref={searchRef} className="klm-chrome klm-search klm-wool-walnut">
      <form onSubmit={(e) => e.preventDefault()} className="klm-search-form">
        <div className="klm-search-field">
          <label htmlFor="klm-search-input" className="shrink-0">
            <KilimIcon name="search" fg={WOOL.saffron} />
            <span className="sr-only">Find</span>
          </label>
          <div className="klm-search-input-wrap">
            <input
              id="klm-search-input"
              ref={inputRef}
              type="text"
              placeholder={isLoading ? 'Winding the yarn…' : 'Search the codex…'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              className="klm-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="klm-search-clear"
              >
                <KilimIcon name="close" fg={WOOL.madder} />
              </button>
            )}
          </div>
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="klm-search-drop klm-wool-indigo">
            <KilimStripe />
            <ol className="klm-search-list">
              {searchResults.map((result, index) => (
                <li key={`${result.slug || result.commandId}-${index}`}>
                  <Link
                    to={result.path || '/'}
                    onClick={() => {
                      setSearchTerm('');
                      setIsDropdownOpen(false);
                      if (toggleSearch) toggleSearch();
                    }}
                    className="klm-row klm-search-row"
                  >
                    <KilimBadge seed={result.slug || result.title} size={9} />
                    <div className="min-w-0">
                      <p className="klm-row-title truncate">{result.title}</p>
                      {result.description && (
                        <p className="klm-search-desc">{result.description}</p>
                      )}
                    </div>
                    <span className="klm-tag shrink-0">{result.type}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="klm-search-foot klm-wool-walnut">
              <span className="klm-label">
                {searchResults.length} {searchResults.length === 1 ? 'entry' : 'entries'} found
              </span>
              <span className="klm-label">Kilim lookup</span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="klm-notice klm-search-empty">
            <p className="m-0">No results for “{searchTerm}”</p>
            <p className="m-0 mt-1" style={{ fontFamily: 'var(--klm-text)', fontSize: 14 }}>
              Try a different word or a shorter search.
            </p>
          </div>
        )}
      </form>
      <KilimStripe />
    </div>
  );
};

export default KilimSearch;
