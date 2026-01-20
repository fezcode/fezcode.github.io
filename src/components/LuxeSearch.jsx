import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, XCircleIcon, ArrowRightIcon } from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';

const luxeCategoryColors = {
  page: 'text-red-600 bg-red-50',
  command: 'text-amber-600 bg-amber-50',
  post: 'text-blue-600 bg-blue-50',
  project: 'text-orange-600 bg-orange-50',
  log: 'text-rose-600 bg-rose-50',
  app: 'text-teal-600 bg-teal-50',
  story: 'text-violet-600 bg-violet-50',
  notebook: 'text-lime-600 bg-lime-50',
};

const getCategoryStyle = (type) => {
  return luxeCategoryColors[type] || 'text-gray-600 bg-gray-50';
};

const LuxeSearch = ({ isVisible, toggleSearch }) => {
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
      className="w-full bg-[#F5F5F0]/95 backdrop-blur-md py-8 px-6 border-b border-[#1A1A1A]/5 relative z-50 shadow-sm"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-3xl mx-auto"
      >
        <div className="relative group">
          <MagnifyingGlassIcon
            size={24}
            weight="light"
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors ${searchTerm ? 'text-[#8D4004]' : 'text-[#1A1A1A]/20 group-focus-within:text-[#8D4004]'}`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? 'Synchronizing Registry...' : 'Search the archive...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-transparent text-[#1A1A1A] border-b border-[#1A1A1A]/10 py-4 pl-12 pr-12 focus:outline-none focus:border-[#8D4004] transition-all font-playfairDisplay italic text-xl md:text-2xl placeholder-[#1A1A1A]/10"
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#1A1A1A]/20 hover:text-red-500 transition-colors"
            >
              <XCircleIcon size={24} weight="light" />
            </button>
          )}
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute mt-6 w-full bg-white border border-[#1A1A1A]/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] z-[100] left-0 overflow-hidden rounded-sm">
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
                  className="flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A]/5 hover:bg-[#F5F5F0] transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-playfairDisplay text-lg italic text-[#1A1A1A]/80 group-hover:text-[#1A1A1A] transition-colors truncate">
                      {result.title}
                    </span>
                    {result.description && (
                      <span className="text-[10px] font-outfit uppercase tracking-[0.2em] text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors line-clamp-1">
                        {result.description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={`px-2 py-0.5 text-[9px] font-outfit font-bold uppercase tracking-widest rounded-sm shadow-sm ${getCategoryStyle(result.type)}`}>
                      {result.type}
                    </span>
                    <ArrowRightIcon size={16} className="text-[#1A1A1A]/10 group-hover:text-[#8D4004] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-[#FAFAF8] px-8 py-3 border-t border-[#1A1A1A]/5 flex justify-between items-center">
              <span className="text-[9px] font-outfit text-[#1A1A1A]/20 uppercase tracking-[0.2em]">
                {searchResults.length} entries matching
              </span>
              <span className="text-[9px] font-playfairDisplay italic text-[#1A1A1A]/20">
                Fezcodex Architectural Search
              </span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="absolute mt-6 w-full bg-white border border-[#1A1A1A]/5 p-12 text-center shadow-xl z-[100] left-0 rounded-sm">
            <p className="font-playfairDisplay italic text-lg text-[#1A1A1A]/20">
              No archive records found for: <span className="text-[#8D4004] opacity-100">{searchTerm}</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LuxeSearch;
