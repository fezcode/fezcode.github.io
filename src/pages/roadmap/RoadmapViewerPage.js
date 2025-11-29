import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { ArrowLeftIcon, KanbanIcon, ListBulletsIcon } from '@phosphor-icons/react';
import piml from 'piml';
import RoadmapView from '../../components/roadmap/RoadmapView';
import TableView from '../../components/roadmap/TableView';

const RoadmapViewerPage = () => {
  useSeo({
    title: 'Fezzilla Issue Tracking | Fezcodex',
    description: 'Roadmap and status of all applications and tools.',
    keywords: ['Fezcodex', 'roadmap', 'apps', 'status', 'tools'],
    ogTitle: 'Fezzilla Issue Tracking | Fezcodex',
    ogDescription: 'Roadmap and status of all applications and tools.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Fezzilla Issue Tracking | Fezcodex',
    twitterDescription: 'Roadmap and status of all applications and tools.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [issuesData, setIssuesData] = useState([]);
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap' or 'table'

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const pimlResponse = await fetch('/roadmap/roadmap.piml');
        if (!pimlResponse.ok) {
          throw new Error(`HTTP error! status: ${pimlResponse.status}`);
        }
        const issuesPimlText = await pimlResponse.text();
        const issuesData = piml.parse(issuesPimlText);
        setIssuesData(issuesData.issues);
      } catch (error) {
        console.error('Failed to fetch roadmap data:', error);
      }
    };

    fetchRoadmap();
  }, []);

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/"
          className="group text-primary-400 hover:underline flex items-center gap-2 text-lg mb-8"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Home
        </Link>

        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-mono mb-4">
            FEZZILLA <span className="text-gray-600">//</span> ROADMAP
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-mono tracking-wide">
            [ TRACKING PROJECT STATUS AND PROGRESS ]
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-4 p-1 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-5 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 flex items-center gap-2 border-2 ${
              viewMode === 'roadmap'
                ? 'bg-indigo-500/30 text-white shadow-lg border-indigo-500'
                : 'bg-transparent text-gray-300 border-gray-700 hover:border-indigo-500 hover:bg-primary-700/20'
            }`}
          >
            <KanbanIcon size={20} /> Roadmap View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-5 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 flex items-center gap-2 border-2 ${
              viewMode === 'table'
                ? 'bg-indigo-500/30 text-white shadow-lg border-indigo-500'
                : 'bg-transparent text-gray-300 border-gray-700 hover:border-indigo-500 hover:bg-primary-700/20'
            }`}
          >
          <ListBulletsIcon size={20} /> Table View
          </button>
        </div>

        {viewMode === 'roadmap' ? <RoadmapView issuesData={issuesData} /> : <TableView issuesData={issuesData} />}
      </div>
    </div>
  );
};

export default RoadmapViewerPage;
