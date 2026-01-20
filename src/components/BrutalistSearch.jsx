import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, XCircleIcon, HashIcon } from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';

const categoryColorMap = {
  page: 'text-red-400 border-red-400/20 bg-red-400/5',
  command: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  post: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  project: 'text-orange-400 border-orange-400/20 bg-orange-400/5',
  log: 'text-rose-400 border-rose-400/20 bg-rose-400/5',
  app: 'text-teal-400 border-teal-400/20 bg-teal-400/5',
  story: 'text-violet-400 border-violet-400/20 bg-violet-400/5',
  notebook: 'text-lime-400 border-lime-400/20 bg-lime-400/5',
};

const getCategoryStyle = (type) => {
  return categoryColorMap[type] || 'text-gray-400 border-white/10 bg-white/5';
};

const BrutalistSearch = ({ isVisible, toggleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { items, isLoading } = useSearchableData();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (searchTerm) {
      const results = filterItems(items, searchTerm).slice(0, 8); // Limit results for clean look
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getResultLink = (result) => {
    return result.path || '/';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={searchRef}
      className="w-full bg-[#050505]/95 backdrop-blur-md py-6 px-6 border-b border-white/10 relative z-50"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="relative group">
          <MagnifyingGlassIcon
            size={20}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors ${searchTerm ? 'text-emerald-500' : 'text-gray-600 group-focus-within:text-emerald-500'}`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? 'SYNCHRONIZING REGISTRY...' : 'SEARCH...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-transparent text-white border-b border-white/10 py-3 pl-10 pr-10 focus:outline-none focus:border-emerald-500 transition-colors font-mono uppercase tracking-[0.2em] text-sm placeholder-gray-800"
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <XCircleIcon size={20} weight="fill" />
            </button>
          )}
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute mt-4 w-full bg-[#0a0a0a] border border-white/10 shadow-2xl z-[100] left-0 overflow-hidden">
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
                  className="flex items-center justify-between px-6 py-4 border-b border-white/5 hover:bg-emerald-500/10 hover:border-l-4 hover:border-l-emerald-500 transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-300 group-hover:text-white uppercase font-mono tracking-tight text-sm truncate">
                      {result.title}
                    </span>
                    {result.description && (
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-600 group-hover:text-gray-400 line-clamp-1">
                        {result.description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest border rounded-sm ${getCategoryStyle(result.type)}`}>
                      {result.type}
                    </span>
                    <HashIcon size={14} className="text-gray-800 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-white/[0.02] px-6 py-2 border-t border-white/5 flex justify-between items-center">
              <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                Showing top {searchResults.length} matches
              </span>
              <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                Fezcodex_Search_v2
              </span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="absolute mt-4 w-full bg-[#0a0a0a] border border-white/10 p-8 text-center shadow-2xl z-[100] left-0">
            <p className="font-mono text-xs text-gray-600 uppercase tracking-[0.3em]">
              No_Results_Found_For: <span className="text-red-500">{searchTerm}</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default BrutalistSearch;
