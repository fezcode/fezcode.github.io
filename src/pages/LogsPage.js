import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CaretDown, CaretUp } from '@phosphor-icons/react';
import LogCard from '../components/LogCard';
import ColorLegends, { categoryStyles } from '../components/ColorLegends';
import usePageTitle from "../utils/usePageTitle";

const LogsPage = () => {
    usePageTitle('Logs <?>');
  const [logs, setLogs] = useState([]);
  const [showLegends, setShowLegends] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hiddenLegends, setHiddenLegends] = useState([]);
  const [allCategoriesSelected, setAllCategoriesSelected] = useState(true);

  const handleToggleAllCategories = () => {
    if (allCategoriesSelected) {
      setHiddenLegends(Object.keys(categoryStyles));
    } else {
      setHiddenLegends([]);
    }
    setAllCategoriesSelected(!allCategoriesSelected);
  };

  const handleLegendClick = (legend) => {
    setHiddenLegends((prevHiddenLegends) => {
      const newHiddenLegends = prevHiddenLegends.includes(legend)
        ? prevHiddenLegends.filter((item) => item !== legend)
        : [...prevHiddenLegends, legend];

      // Update allCategoriesSelected based on the new state of hiddenLegends
      if (newHiddenLegends.length === 0) {
        setAllCategoriesSelected(true);
      } else if (newHiddenLegends.length === Object.keys(categoryStyles).length) {
        setAllCategoriesSelected(false);
      } else {
        // If some are selected and some are not, it's neither all selected nor all deselected
        setAllCategoriesSelected(false);
      }
      return newHiddenLegends;
    });
  };

  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    setFilteredLogs(
      logs.filter((log) => !hiddenLegends.includes(log.category))
    );
  }, [logs, hiddenLegends]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/logs/logs.json');
        const data = await response.json();
        const logsWithId = data.map((log, index) => ({ ...log, id: `${log.title}-${log.date}-${index}`, originalIndex: index }));
        setLogs(logsWithId);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    // Skeleton loading screen for LogsPage
    return (
      <div className="py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
          <hr className="border-gray-700 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/" className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon size={24} /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-primary-400 sm:text-6xl mb-4 flex items-center">
          Logs
        </h1>
        <div
          className="relative flex justify-center items-center w-full cursor-pointer"
          onClick={() => setShowLegends(!showLegends)}
        >
          <hr className="border-gray-700 w-full absolute top-1/2 -translate-y-1/2" />
          <div className="relative border border-gray-700 bg-gray-900 px-4 z-10">
            {showLegends ? (
              <CaretUp size={32} className="text-primary-400" />
            ) : (
              <CaretDown size={32} className="text-primary-400" />
            )}
          </div>
        </div>
        {showLegends && (
          <div className="mx-auto p-6 border border-gray-700 shadow-lg text-center bg-gray-900 opacity-80 mt-[-16px] mb-8" >
            <h2 className="mb-[-16px] text-xl font-light tracking-tight text-white">Categories</h2>
            <ColorLegends
              onLegendClick={handleLegendClick}
              hiddenLegends={hiddenLegends}
            />
            <div className="flex items-center justify-center mt-4">
              <span className="mr-2 text-white text-sm">Disable All</span>
              <label htmlFor="toggle-all-categories" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="toggle-all-categories"
                    className="sr-only"
                    checked={allCategoriesSelected}
                    onChange={handleToggleAllCategories}
                  />
                  <div className={`block w-10 h-6 rounded-full ${allCategoriesSelected ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${allCategoriesSelected ? 'translate-x-4 bg-primary-500' : ''}`}
                  ></div>
                </div>
              </label>
              <span className="ml-2 text-white text-sm">Enable All</span>
            </div>
          </div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${!showLegends ? 'mt-8' : ''}`}>
          {filteredLogs.map((log) => (
            <LogCard key={log.id} log={log} index={log.originalIndex} totalLogs={logs.length} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default LogsPage;
