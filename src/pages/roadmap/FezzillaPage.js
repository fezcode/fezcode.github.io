import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { ArrowLeft } from '@phosphor-icons/react';
import piml from 'piml';
import RoadmapView from '../../components/roadmap/RoadmapView';
import TableView from '../../components/roadmap/TableView';
import { useAchievements } from '../../context/AchievementContext';

const FezzillaPage = () => {
  useSeo({
    title: 'Roadmap | Fezcodex',
    description: 'Project status and future development tracking.',
    keywords: ['Fezcodex', 'roadmap', 'apps', 'status', 'tools'],
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20 text-center md:text-left">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                Roadmap
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-2xl uppercase tracking-[0.2em] leading-relaxed mx-auto md:mx-0">
                Tracking status, progress, and future milestones of all digital
                artifacts.
              </p>
            </div>

            <div className="flex bg-white/5 border border-white/10 rounded-sm p-1">
              <button
                onClick={() => setViewMode('roadmap')}
                className={`px-6 py-2 text-[10px] font-bold font-mono tracking-widest transition-all ${
                  viewMode === 'roadmap'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                KANBAN
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-6 py-2 text-[10px] font-bold font-mono tracking-widest transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                TABLE
              </button>
            </div>
          </div>
        </header>

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
