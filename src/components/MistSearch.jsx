import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  HashIcon,
} from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';
import { MistHorizon } from './mist';

const categoryToneMap = {
  page: 'text-[#5F837B] bg-[#5F837B]/10',
  command: 'text-[#8FA8BC] bg-[#8FA8BC]/15',
  post: 'text-[#5F837B] bg-[#5F837B]/10',
  project: 'text-[#8FA8BC] bg-[#8FA8BC]/15',
  log: 'text-[#5C6B67] bg-[#5C6B67]/10',
  app: 'text-[#5F837B] bg-[#5F837B]/10',
  story: 'text-[#8FA8BC] bg-[#8FA8BC]/15',
  notebook: 'text-[#5C6B67] bg-[#5C6B67]/10',
};

const getCategoryTone = (type) =>
  categoryToneMap[type] || 'text-[#5C6B67] bg-[#5C6B67]/10';

const MistSearch = ({ isVisible, toggleSearch }) => {
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
      className="w-full bg-[#EEF2F1]/90 backdrop-blur-md py-6 px-6 relative z-50"
    >
      {/* bottom edge — a horizon, never a hard border */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(60,72,69,0.14), transparent)',
        }}
      />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="relative group">
          <MagnifyingGlassIcon
            size={18}
            weight="light"
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors ${
              searchTerm
                ? 'text-[#5F837B]'
                : 'text-[#8A9894] group-focus-within:text-[#5F837B]'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? 'condensing index…' : 'search the fog…'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-transparent text-[#3C4845] py-3 pl-9 pr-10 focus:outline-none font-ibm-plex-mono lowercase tracking-[0.16em] text-sm placeholder-[#8A9894]/70 selection:bg-[#8FA8BC]/30"
            disabled={isLoading}
          />
          {/* resting baseline — fading hairline */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 bottom-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(60,72,69,0.14), transparent)',
            }}
          />
          {/* focus baseline — eucalyptus surfacing through the haze */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 bottom-0 h-px opacity-0 group-focus-within:opacity-100 transition-opacity duration-[400ms]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(95,131,123,0.6), transparent)',
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#8A9894] hover:text-[#5F837B] transition-colors"
            >
              <XCircleIcon size={18} weight="light" />
            </button>
          )}
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute mt-4 w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_18px_50px_rgba(60,72,69,0.18)] z-[100] left-0 overflow-hidden">
            <div className="flex flex-col">
              {searchResults.map((result, index) => (
                <React.Fragment
                  key={`${result.slug || result.commandId}-${index}`}
                >
                  {index > 0 && <MistHorizon tint="rgba(60,72,69,0.10)" />}
                  <Link
                    to={getResultLink(result)}
                    onClick={() => {
                      setSearchTerm('');
                      setIsDropdownOpen(false);
                      if (toggleSearch) toggleSearch();
                    }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#8FA8BC]/15 transition-colors duration-[250ms] group"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-instr-serif italic text-[#3C4845] text-lg leading-snug truncate group-hover:text-[#5F837B] transition-colors duration-[250ms]">
                        {result.title}
                      </span>
                      {result.description && (
                        <span className="text-[9px] font-ibm-plex-mono lowercase tracking-[0.16em] text-[#8A9894] line-clamp-1">
                          {result.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`px-2.5 py-0.5 text-[8px] font-ibm-plex-mono lowercase tracking-[0.2em] rounded-full ${getCategoryTone(result.type)}`}
                      >
                        {result.type}
                      </span>
                      <HashIcon
                        size={13}
                        weight="light"
                        className="text-[#8A9894]/60 group-hover:text-[#5F837B] transition-colors duration-[250ms]"
                      />
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
            <MistHorizon />
            <div className="bg-[#E5EBE9]/60 px-6 py-2.5 flex justify-between items-center">
              <span className="text-[8px] font-ibm-plex-mono lowercase tracking-[0.22em] text-[#8A9894]">
                {searchResults.length} drifted to the surface
              </span>
              <span className="text-[8px] font-ibm-plex-mono lowercase tracking-[0.22em] text-[#8A9894]">
                mist search · v1
              </span>
            </div>
          </div>
        )}

        {isDropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="absolute mt-4 w-full bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-[0_18px_50px_rgba(60,72,69,0.18)] z-[100] left-0">
            <p className="font-ibm-plex-mono text-xs text-[#5C6B67] lowercase tracking-[0.22em]">
              nothing surfaced for{' '}
              <span className="text-[#5F837B]">{searchTerm}</span>
            </p>
            <p className="mt-2 font-ibm-plex-mono text-[9px] text-[#8A9894] lowercase tracking-[0.22em]">
              visibility: low
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default MistSearch;
