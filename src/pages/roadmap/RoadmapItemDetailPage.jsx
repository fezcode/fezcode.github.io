import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSeo from '../../hooks/useSeo';
import {
  ArrowLeft,
  CalendarBlank,
  CheckCircle,
  Circle,
  CircleDashed,
  DotsThree,
  Hash,
  SquareHalfBottom,
  Tag,
  User,
  XCircle,
} from '@phosphor-icons/react';
import piml from 'piml';
import { motion } from 'framer-motion';

// Reuse Status Icons (could be shared utility)
const StatusIcon = ({ status, className = "" }) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
      return <CheckCircle weight="fill" className={`text-indigo-400 ${className}`} />;
    case 'in progress':
      return <SquareHalfBottom weight="fill" className={`text-amber-400 ${className}`} />;
    case 'planned':
    case 'todo':
      return <Circle className={`text-gray-400 ${className}`} />;
    case 'on hold':
    case 'backlog':
      return <CircleDashed className={`text-gray-500 ${className}`} />;
    case 'cancelled':
    case 'canceled':
      return <XCircle className={`text-red-400 ${className}`} />;
    default:
      return <Circle className={`text-gray-600 ${className}`} />;
  }
};

const PriorityIcon = ({ priority, className = "" }) => {
  switch (priority?.toLowerCase()) {
    case 'high':
    case 'urgent':
      return <div className={`flex gap-0.5 items-end ${className}`}><div className="w-1 h-1.5 bg-red-500 rounded-[1px]"/><div className="w-1 h-2.5 bg-red-500 rounded-[1px]"/><div className="w-1 h-3.5 bg-red-500 rounded-[1px]"/></div>;
    case 'medium':
      return <div className={`flex gap-0.5 items-end ${className}`}><div className="w-1 h-1.5 bg-orange-400 rounded-[1px]"/><div className="w-1 h-2.5 bg-orange-400 rounded-[1px]"/><div className="w-1 h-3.5 bg-white/20 rounded-[1px]"/></div>;
    case 'low':
      return <div className={`flex gap-0.5 items-end ${className}`}><div className="w-1 h-1.5 bg-gray-400 rounded-[1px]"/><div className="w-1 h-2.5 bg-white/20 rounded-[1px]"/><div className="w-1 h-3.5 bg-white/20 rounded-[1px]"/></div>;
    default:
      return <DotsThree className={`text-gray-600 ${className}`} />;
  }
};

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
        const parsed = piml.parse(issuesPimlText);

        let allIssues = [];
        let data = parsed.issues || [];

        // Helper to flatten nested issues structure
        const flatten = (items) => {
           let result = [];
           const list = Array.isArray(items) ? items : [items];
           list.forEach(item => {
               if (item.issues) {
                   result = result.concat(flatten(item.issues));
               } else {
                   result.push(item);
               }
           });
           return result;
        };

        allIssues = flatten(data);
        const foundItem = allIssues.find((item) => item.id === id);
        setRoadmapItem(foundItem);
      } catch (error) {
        console.error('Failed to fetch roadmap item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapItem();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-gray-500">
        <span className="animate-pulse font-mono text-xs">Loading Issue...</span>
      </div>
    );
  }

  if (!roadmapItem) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-gray-400 gap-4">
        <span className="font-mono text-sm">Issue {id} not found</span>
        <Link to="/roadmap" className="text-white hover:underline text-sm">Return to Roadmap</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#e5e5e5] font-sans selection:bg-indigo-500/30">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06] h-14 flex items-center px-6">
        <div className="flex items-center gap-4 text-sm">
           <Link to="/roadmap" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
             <ArrowLeft size={16} />
             <span className="hidden md:inline">Roadmap</span>
           </Link>
           <span className="text-gray-700">/</span>
           <span className="font-mono text-gray-400">{roadmapItem.id}</span>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto p-6 md:p-12 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Main Content */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-8 space-y-8"
        >
           <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
                {roadmapItem.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-8">
                 <span className="flex items-center gap-1.5">
                   <User size={14} />
                   Fezcodex
                 </span>
                 <span>•</span>
                 <span>opened {new Date(roadmapItem.created_at).toLocaleDateString()}</span>
              </div>
           </div>

           <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-200 max-w-none text-[15px] leading-relaxed">
              <p>{roadmapItem.description}</p>
           </div>

           {roadmapItem.notes && (
             <div className="mt-12 pt-8 border-t border-white/[0.06]">
                <h3 className="text-sm font-medium text-gray-400 mb-6">Activity</h3>
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/30">
                      <User size={14} weight="bold" />
                   </div>
                   <div className="grow space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-medium text-gray-300">Fezcodex</span>
                         <span className="text-[10px] text-gray-600">Note</span>
                      </div>
                      <div className="bg-[#121212] border border-white/[0.06] rounded-md p-4 text-sm text-gray-400">
                         {roadmapItem.notes}
                      </div>
                   </div>
                </div>
             </div>
           )}
        </motion.div>

        {/* Sidebar */}
        <motion.aside
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="lg:col-span-4 mt-12 lg:mt-0 space-y-8"
        >
           {/* Status Section */}
           <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                 <span className="text-xs font-medium text-gray-500">Status</span>
                 <div className="flex items-center gap-2 text-xs font-medium text-gray-200 bg-white/[0.05] px-2 py-1 rounded">
                    <StatusIcon status={roadmapItem.status} className="w-3.5 h-3.5" />
                    <span>{roadmapItem.status || 'Planned'}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                 <span className="text-xs font-medium text-gray-500">Priority</span>
                 <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
                    <PriorityIcon priority={roadmapItem.priority} />
                    <span>{roadmapItem.priority || 'None'}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                 <span className="text-xs font-medium text-gray-500">Assignee</span>
                 <div className="flex items-center gap-2 text-xs text-gray-300">
                    <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                            (roadmapItem.assignee || 'Fezcodex').toLowerCase().includes('gemini')
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-gray-800 border-white/10 text-gray-400'
                        }`}
                    >
                        {(roadmapItem.assignee || 'Fezcodex').charAt(0).toUpperCase()}
                    </div>
                    <span>{roadmapItem.assignee || 'Fezcodex'}</span>
                 </div>
              </div>

              {roadmapItem.category && (
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                   <span className="text-xs font-medium text-gray-500">Labels</span>
                   <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-white/[0.05] text-gray-400 border border-white/[0.05] text-[11px]">
                      <Tag size={12} />
                      {roadmapItem.category}
                   </span>
                </div>
              )}

               {roadmapItem.epic && (
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                   <span className="text-xs font-medium text-gray-500">Project</span>
                   <span className="inline-flex items-center gap-1 text-gray-400 text-[11px]">
                      <Hash size={12} />
                      {roadmapItem.epic}
                   </span>
                </div>
              )}

              {roadmapItem.due_date && (
                 <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-xs font-medium text-gray-500">Due Date</span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                       <CalendarBlank size={12} />
                       {new Date(roadmapItem.due_date).toLocaleDateString()}
                    </span>
                 </div>
              )}
           </div>

           <div className="text-[10px] text-gray-600 font-mono">
              <div className="flex justify-between py-1">
                 <span>Created</span>
                 <span>{new Date(roadmapItem.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1">
                 <span>Updated</span>
                 <span>{new Date().toLocaleDateString()}</span>
              </div>
           </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default RoadmapItemDetailPage;