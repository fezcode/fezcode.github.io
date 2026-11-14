import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';
import { BlissWindow } from './bliss';
import '../styles/Bliss.css';

const BlissSearch = ({ isVisible, toggleSearch }) => {
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
    <div
      ref={searchRef}
      className="bl-chrome w-full relative z-50 px-3 py-3"
    >
      <BlissWindow
        as="div"
        title="Search"
        icon={MagnifyingGlassIcon}
        tone="blue"
        headingLevel={null}
        onClose={toggleSearch}
        closeLabel="Close search"
        className="relative w-full max-w-2xl mx-auto"
        style={{ overflow: 'visible' }}
      >
        <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
          <div className="flex items-center gap-3">
            <label
              htmlFor="bl-search-input"
              className="bl-label shrink-0 flex items-center gap-2"
            >
              <MagnifyingGlassIcon size={18} weight="bold" aria-hidden="true" />
              Find
            </label>
            <div className="relative flex-1">
              <input
                id="bl-search-input"
                ref={inputRef}
                type="text"
                placeholder={
                  isLoading ? 'Loading the index…' : 'Search the codex…'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                className="bl-input"
                style={{ paddingRight: searchTerm ? 40 : undefined }}
                disabled={isLoading}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="bl-btn bl-btn-icon bl-btn-sm absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <XIcon size={14} weight="bold" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {isDropdownOpen && searchResults.length > 0 && (
            <BlissWindow
              as="div"
              title="Search results"
              icon={MagnifyingGlassIcon}
              tone="green"
              headingLevel={null}
              flush
              inactive
              className="absolute mt-3 left-0 right-0 z-[100]"
              bodyClassName="overflow-y-auto min-h-0"
              style={{ maxHeight: '60vh' }}
              status={
                <>
                  <span>
                    {searchResults.length}{' '}
                    {searchResults.length === 1 ? 'entry' : 'entries'} found
                  </span>
                  <span>Fezcodex search</span>
                </>
              }
            >
              <ol
                className="list-none m-0 p-0"
                style={{ background: 'var(--bl-paper)' }}
              >
                {searchResults.map((result, index) => (
                  <li key={`${result.slug || result.commandId}-${index}`}>
                    <Link
                      to={result.path || '/'}
                      onClick={() => {
                        setSearchTerm('');
                        setIsDropdownOpen(false);
                        if (toggleSearch) toggleSearch();
                      }}
                      className="bl-row"
                    >
                      <div className="bl-row-body">
                        <span className="bl-row-title truncate">
                          {result.title}
                        </span>
                        {result.description && (
                          <span className="bl-meta truncate">
                            {result.description}
                          </span>
                        )}
                      </div>
                      <span className="bl-tag shrink-0">{result.type}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </BlissWindow>
          )}

          {isDropdownOpen && searchTerm && searchResults.length === 0 && (
            <div className="bl-notice absolute mt-3 left-0 right-0 z-[100] flex-col text-center">
              <p className="m-0 font-bold">No results for “{searchTerm}”</p>
              <p className="bl-muted m-0 text-sm">
                Try a different word or a shorter search.
              </p>
            </div>
          )}
        </form>
      </BlissWindow>
    </div>
  );
};

export default BlissSearch;
