import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { ArrowLeftIcon, KanbanIcon, ListBulletsIcon } from '@phosphor-icons/react';
import piml from 'piml';
import RoadmapView from '../../components/roadmap/RoadmapView';
import TableView from '../../components/roadmap/TableView';
import { useAchievements } from '../../context/AchievementContext';

const FezzillaPage = () => {
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
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('path_finder');
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
  }, [unlockAchievement]);

  return (
    <div className="min-h-screen py-8 sm:py-16 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary-900/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="mx-auto px-6 lg:px-8">
        <Link
          to="/"
          className="group text-gray-400 hover:text-primary-400 flex items-center gap-2 text-lg mb-8 w-fit transition-colors duration-300"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />
          <span className="font-mono">Back to Home</span>
        </Link>

        <div className="mx-auto max-w-3xl text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-mono mb-4">
            <span className="bg-gradient-to-r from-primary-400 via-red-500 to-secondary-400 text-transparent bg-clip-text">
              FEZZILLA
            </span>
            <span className="text-gray-700 ml-4">//</span>
            <span className="text-gray-200 ml-4">ROADMAP</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-400 font-mono text-sm md:text-base tracking-widest uppercase">
            <span className="w-8 h-[1px] bg-gray-700"></span>
            <span>Tracking Project Status & Progress</span>
            <span className="w-8 h-[1px] bg-gray-700"></span>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex p-1.5 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl">
            <button
              onClick={() => setViewMode('roadmap')}
              className={`
                relative px-6 py-2.5 rounded-xl text-sm font-bold font-mono transition-all duration-300 flex items-center gap-2.5
                ${
                  viewMode === 'roadmap'
                    ? 'text-primary-400 bg-primary-600/20 shadow-lg shadow-primary-900/20 ring-1 ring-primary-500/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }
              `}
            >
              <KanbanIcon size={20} weight={viewMode === 'roadmap' ? 'fill' : 'regular'} />
              ROADMAP
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`
                relative px-6 py-2.5 rounded-xl text-sm font-bold font-mono transition-all duration-300 flex items-center gap-2.5
                ${
                  viewMode === 'table'
                    ? 'text-primary-400 bg-primary-600/20 shadow-lg shadow-primary-900/20 ring-1 ring-primary-500/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }
              `}
            >
              <ListBulletsIcon size={20} weight={viewMode === 'table' ? 'fill' : 'regular'} />
              TABLE
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          {viewMode === 'roadmap' ? (
            <RoadmapView issuesData={issuesData} />
          ) : (
            <TableView issuesData={issuesData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FezzillaPage;
