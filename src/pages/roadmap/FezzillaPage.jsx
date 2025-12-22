import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import { ArrowLeft } from '@phosphor-icons/react';
import piml from 'piml';
import RoadmapView from '../../components/roadmap/RoadmapView';
import TableView from '../../components/roadmap/TableView';
import { useAchievements } from '../../context/AchievementContext';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

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
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-24 relative">
          <Link
            to="/"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeft weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4 relative z-10">
              <BreadcrumbTitle
                title="Roadmap"
                slug="roadmap"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Architectural mapping of digital artifacts. Tracking the evolution from conceptual blueprints to stable deployments.
              </p>
            </div>

            <div className="flex bg-white/[0.03] border border-white/10 p-1 rounded-sm relative z-10">
              <button
                onClick={() => setViewMode('roadmap')}
                className={`px-6 py-2 text-[10px] font-black font-mono tracking-[0.2em] transition-all rounded-sm ${
                  viewMode === 'roadmap'
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                KANBAN
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-6 py-2 text-[10px] font-black font-mono tracking-[0.2em] transition-all rounded-sm ${
                  viewMode === 'table'
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                TABLE
              </button>
            </div>
          </div>

          <div className="absolute -top-24 -right-12 w-96 h-96 opacity-[0.03] pointer-events-none grayscale">
            <GenerativeArt seed="roadmap-header" className="w-full h-full" />
          </div>
        </header>

        <div className="transition-all duration-500 ease-in-out">
          {viewMode === 'roadmap' ? (
            <RoadmapView issuesData={issuesData} />
          ) : (
            <TableView issuesData={issuesData} />
          )}
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezzilla_Artifact_Tracker_v2.1.0</span>
          <span className="text-gray-800">STATUS // SYNCHRONIZED</span>
        </footer>
      </div>
    </div>
  );
};

export default FezzillaPage;
