import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, XCircleIcon, HashIcon } from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';

const categoryColorMap = {
  page: 'text-[#9E4A2F] border-[#9E4A2F]/30 bg-[#9E4A2F]/10',
  command: 'text-[#B88532] border-[#B88532]/30 bg-[#B88532]/10',
  post: 'text-[#6B8E23] border-[#6B8E23]/30 bg-[#6B8E23]/10',
  project: 'text-[#C96442] border-[#C96442]/30 bg-[#C96442]/10',
  log: 'text-[#9E4A2F] border-[#9E4A2F]/30 bg-[#9E4A2F]/10',
  app: 'text-[#6B8E23] border-[#6B8E23]/30 bg-[#6B8E23]/10',
  story: 'text-[#8A6A32] border-[#8A6A32]/30 bg-[#8A6A32]/10',
  notebook: 'text-[#6B8E23] border-[#6B8E23]/30 bg-[#6B8E23]/10',
};

const getCategoryStyle = (type) =>
  categoryColorMap[type] || 'text-[#2E2620] border-[#1A161320] bg-[#E8DECE]';

const TerracottaSearch = ({ isVisible, toggleSearch }) => {
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
      className="w-full bg-[#F3ECE0]/95 backdrop-blur-md py-6 px-6 border-b border-[#1A161320] relative z-50"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="relative group">
          <MagnifyingGlassIcon
            size={20}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors ${
              searchTerm ? 'text-[#C96442]' : 'text-[#2E2620]/40 group-focus-within:text-[#C96442]'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? 'Loading index...' : 'Search...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-transparent text-[#1A1613] border-b border-[#1A161320] py-3 pl-10 pr-10 focus:outline-none focus:border-[#C96442] transition-colors font-mono uppercase tracking-[0.2em] text-sm placeholder-[#2E2620]/30"
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#2E2620]/40 hover:text-[#9E4A2F] transition-colors"
            >
              <XCircleIcon size={20} weight="fill" />
            </button>
          )}
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute mt-4 w-full bg-[#F3ECE0] border border-[#1A161320] shadow-[0_30px_60px_-30px_#1A161340] z-[100] left-0 overflow-hidden">
            <div className="flex flex-col">
              {searchResults.map((result, index) => (
                <Link
                  key={`${result.slug || result.commandId}-${index}`}
                  to={getResultLink(result)}
                  onClick={() => {
                    setSearchTerm('');
                    setIsDropdownOpen(false);
                    if (toggleSearch) toggleSearch();
                  }}
                  className="flex items-center justify-between px-6 py-4 border-b border-[#1A161320] hover:bg-[#C96442]/10 hover:border-l-4 hover:border-l-[#C96442] transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-playfairDisplay italic text-[#1A1613] uppercase tracking-tight text-lg truncate">
                      {result.title}
                    </span>
                    {result.description && (
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#2E2620]/50 line-clamp-1">
                        {result.description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest border rounded-sm ${getCategoryStyle(result.type)}`}
                    >
                      {result.type}
                    </span>
                    <HashIcon
                      size={14}
                      className="text-[#2E2620]/30 group-hover:text-[#C96442] transition-colors"
                    />
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-[#E8DECE]/60 px-6 py-2 border-t border-[#1A161320] flex justify-between items-center">
              <span className="text-[8px] font-mono text-[#2E2620]/50 uppercase tracking-widest">
                Showing top {searchResults.length} matches
              </span>
              <span className="text-[8px] font-mono text-[#2E2620]/50 uppercase tracking-widest">
                Plumb_Search_v1
              </span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="absolute mt-4 w-full bg-[#F3ECE0] border border-[#1A161320] p-8 text-center shadow-[0_30px_60px_-30px_#1A161340] z-[100] left-0">
            <p className="font-mono text-xs text-[#2E2620]/60 uppercase tracking-[0.3em]">
              No results for: <span className="text-[#9E4A2F]">{searchTerm}</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default TerracottaSearch;
