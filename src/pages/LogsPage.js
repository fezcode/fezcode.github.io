import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import LogCard from '../components/LogCard';
import ColorLegends from '../components/ColorLegends';
import usePageTitle from "../utils/usePageTitle";

const LogsPage = () => {
    usePageTitle('Logs <?>');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/data/logs.json');
        const data = await response.json();
        setLogs(data);
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
        <hr className="border-gray-700 mb-8" />
        <div className="mb-8 mx-auto p-6 border border-gray-700 rounded-lg shadow-lg text-center bg-gray-900">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Legends</h2>
            <ColorLegends />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logs.map((log, index) => (
            <LogCard key={index} log={log} index={index} totalLogs={logs.length} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default LogsPage;
