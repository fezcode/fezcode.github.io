import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import useSearchableData from '../hooks/useSearchableData';
import { filterItems } from '../utils/search';

const Search = ({ isVisible }) => {
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
      const results = filterItems(items, searchTerm);
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
      className="w-full bg-gray-900 py-3 px-4 border-b border-gray-700"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-md mx-auto"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={isLoading ? "Loading..." : "Search..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          className="bg-gray-800 text-white w-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md"
          disabled={isLoading}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute mt-2 w-full max-w-md max-h-96 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 left-1/2 -translate-x-1/2">
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  <Link
                    to={getResultLink(result)}
                    onClick={() => {
                      setSearchTerm('');
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-white hover:bg-gray-700"
                  >
                    <span className="font-bold">{result.title}</span>
                    <span className="text-sm text-gray-400 ml-2">
                      ({result.type})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
