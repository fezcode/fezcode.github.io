import React, { useState, useEffect } from 'react';
import LogCard from '../components/LogCard';

import ColorLegends from '../components/ColorLegends';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/data/logs.json');
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <h1 className="text-4xl font-bold tracking-tight text-primary-400 sm:text-6xl mb-8 flex items-center">
          <div className="bg-primary-400 h-12 w-1 mr-4"></div> Logs
        </h1>
        <hr className="border-gray-700 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logs.map((log, index) => (
            <LogCard key={index} log={log} />
          ))}
        </div>
        <ColorLegends />
      </div>
    </div>
  );
};

export default LogsPage;
