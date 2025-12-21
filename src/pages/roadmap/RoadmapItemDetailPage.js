import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import {
  ArrowLeft,
  Lightning,
  Circle,
  ArrowsClockwise,
  CheckCircle,
  PauseCircle,
  Fire,
  Equals,
  ArrowDown,
} from '@phosphor-icons/react';
import piml from 'piml';
import {
  getStatusClasses,
  getPriorityClasses,
} from '../../utils/roadmapHelpers';
import GenerativeArt from '../../components/GenerativeArt';

const RoadmapItemDetailPage = () => {
  const { id } = useParams();
  const [roadmapItem, setRoadmapItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useSeo({
    title: roadmapItem
      ? `${roadmapItem.title} | Roadmap`
      : 'Roadmap Item | Fezcodex',
    description: roadmapItem
      ? roadmapItem.description
      : 'Details of a roadmap item.',
    keywords: ['Fezcodex', 'roadmap', 'item', id],
  });

  useEffect(() => {
    const fetchRoadmapItem = async () => {
      try {
        const pimlResponse = await fetch('/roadmap/roadmap.piml');
        if (!pimlResponse.ok) {
          throw new Error(`HTTP error! status: ${pimlResponse.status}`);
        }
        const issuesPimlText = await pimlResponse.text();
        const issuesData = piml.parse(issuesPimlText);
        const foundItem = issuesData.issues.find((item) => item.id === id);
        setRoadmapItem(foundItem);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch roadmap item:', error);
        setIsLoading(false);
      }
    };

    fetchRoadmapItem();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Planned':
        return <Circle weight="bold" />;
      case 'In Progress':
        return <ArrowsClockwise weight="bold" className="animate-spin" />;
      case 'Completed':
        return <CheckCircle weight="bold" />;
      case 'On Hold':
        return <PauseCircle weight="bold" />;
      default:
        return <Circle weight="bold" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return <Fire weight="fill" />;
      case 'Medium':
        return <Equals weight="bold" />;
      case 'Low':
        return <ArrowDown weight="bold" />;
      default:
        return <ArrowDown weight="bold" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-[10px]">
        <span className="animate-pulse">Accessing_Artifact_Data...</span>
      </div>
    );
  }

  if (!roadmapItem) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-[10px]">
        <span>Error: Artifact_Not_Found [ID: {id}]</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 pb-32">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full overflow-hidden border-b border-white/10">
        <GenerativeArt
          seed={roadmapItem.title + roadmapItem.id}
          className="w-full h-full opacity-40 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12 max-w-7xl mx-auto right-0">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black mb-8"
          >
            <ArrowLeft weight="bold" />
            <span>Back to Protocol</span>
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-widest">
                ID: {roadmapItem.id}
              </span>
              {roadmapItem.epic && (
                <span className="px-2 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-black uppercase tracking-widest">
                  EPIC: {roadmapItem.epic}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none max-w-5xl">
              {roadmapItem.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
              <span className="h-px w-4 bg-emerald-500/30" />
              Technical_Manifest
            </h3>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              {roadmapItem.description}
            </p>
          </div>

          {roadmapItem.notes && (
            <div className="space-y-6 pt-12 border-t border-white/5">
              <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                <span className="h-px w-4 bg-gray-800" />
                Additional_Intel
              </h3>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                <p className="text-gray-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {roadmapItem.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-sm space-y-10">
            <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <Lightning weight="fill" />
              Specifications
            </h3>

            <div className="space-y-8">
              <SpecItem
                label="Status"
                value={roadmapItem.status || 'Planned'}
                icon={getStatusIcon(roadmapItem.status || 'Planned')}
                className={getStatusClasses(roadmapItem.status || 'Planned')}
              />
              <SpecItem
                label="Priority"
                value={roadmapItem.priority || 'Low'}
                icon={getPriorityIcon(roadmapItem.priority || 'Low')}
                className={getPriorityClasses(roadmapItem.priority || 'Low')}
              />
              <SpecItem
                label="Category"
                value={roadmapItem.category}
              />
              <SpecItem
                label="Initialized"
                value={new Date(roadmapItem.created_at).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
              {roadmapItem.due_date && (
                <SpecItem
                  label="Target_Deadline"
                  value={new Date(roadmapItem.due_date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ label, value, icon, className }) => (
  <div className="space-y-2">
    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
      {label}
    </span>
    <div className={`flex items-center gap-2 font-mono text-sm font-black uppercase ${className || 'text-white'}`}>
      {icon}
      <span>{value}</span>
    </div>
  </div>
);

export default RoadmapItemDetailPage;
