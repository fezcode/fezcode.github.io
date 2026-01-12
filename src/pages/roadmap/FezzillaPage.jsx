import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  CircleDashed,
  DotsThree,
  Funnel,
  ListDashes,
  MagnifyingGlass,
  Plus,
  Minus,
  Rows,
  Spinner,
  SquareHalfBottom,
  XCircle,
  CalendarBlank,
  Eye
} from '@phosphor-icons/react';
import piml from 'piml';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../../context/AchievementContext';
import CustomDropdown from '../../components/CustomDropdown';
import RoadmapItemModal from '../../components/roadmap/RoadmapItemModal';

// --- Linear-style Components ---

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
  // Linear uses signal bars for priority, simplified here
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

const IssueCard = ({ issue, viewMode, onClick }) => {
  return (
    <div onClick={() => onClick(issue.id)} className="block w-full text-left">
      <motion.div
        layoutId={issue.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
        className={`group border-b border-white/[0.06] hover:border-white/[0.08] transition-colors cursor-pointer
          ${viewMode === 'board'
            ? 'bg-[#121212] border border-white/[0.08] rounded-md p-3 mb-3 hover:shadow-lg hover:shadow-black/50'
            : 'flex items-center gap-4 py-2.5 px-4 bg-transparent'
          }`}
      >
        {/* Icon / ID */}
        <div className={`flex items-center gap-3 ${viewMode === 'board' ? 'mb-2 justify-between' : 'w-24 shrink-0'}`}>
          <div className="flex items-center gap-2">
              <StatusIcon status={issue.status} className="w-4 h-4 shrink-0" />
              <span className="font-mono text-[10px] text-gray-500 font-medium tracking-wide group-hover:text-gray-400 transition-colors">{issue.id}</span>
          </div>
          {viewMode === 'board' && <PriorityIcon priority={issue.priority} />}
        </div>

        {/* Title */}
        <div className={`${viewMode === 'board' ? 'mb-3' : 'grow min-w-0'}`}>
          <h3 className={`text-[13px] font-medium text-gray-200 truncate group-hover:text-white transition-colors`}>
            {issue.title}
          </h3>
        </div>

        {/* Meta (List View Only mainly, or bottom of card) */}
        <div className={`flex items-center gap-4 ${viewMode === 'board' ? 'justify-between text-[10px]' : 'text-[11px] shrink-0'}`}>
          {/* Tags */}
          {issue.category && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-white/[0.05] text-gray-400 border border-white/[0.05]">
               {issue.category}
            </span>
          )}

          {/* Date - List Only */}
          {viewMode === 'list' && issue.due_date && (
             <span className="flex items-center gap-1.5 text-gray-500 w-24 justify-end">
                <CalendarBlank size={12} />
                {new Date(issue.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
             </span>
          )}

           {/* Priority - List Only */}
           {viewMode === 'list' && (
               <div className="w-8 flex justify-center">
                   <PriorityIcon priority={issue.priority} />
               </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};

const GroupHeader = ({ title, count, icon: Icon, isCollapsed, onToggle }) => (
  <div className="flex items-center gap-2 px-4 py-2 mt-6 mb-1 text-xs font-medium text-gray-400 select-none group">
    {Icon && <Icon size={14} />}
    <span>{title}</span>
    <span className="text-gray-600 font-mono text-[10px] ml-1">{count}</span>
    <div className="h-px bg-white/[0.06] grow ml-3 transition-colors group-hover:bg-white/[0.1]" />
    <button onClick={onToggle} className="p-1 hover:bg-white/10 rounded transition-colors">
      {isCollapsed ? <Plus size={12} /> : <Minus size={12} />}
    </button>
  </div>
);

const FezzillaPage = () => {
  const [issuesData, setIssuesData] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
  const { unlockAchievement } = useAchievements();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedIssueId = searchParams.get('issue');

  useEffect(() => {
    unlockAchievement('path_finder');
    const fetchRoadmap = async () => {
      try {
        const pimlResponse = await fetch('/roadmap/roadmap.piml');
        if (pimlResponse.ok) {
          const issuesPimlText = await pimlResponse.text();
          const parsed = piml.parse(issuesPimlText);
          let data = parsed.issues || [];
           if (data.length > 0 && Array.isArray(data[0].issues)) {
               data = data.flatMap(group => group.issues || []);
           } else if (!Array.isArray(data)) {
               data = [data];
           }

           const flatten = (items) => {
               let result = [];
               items.forEach(item => {
                   if (item.issues) {
                       result = result.concat(flatten(Array.isArray(item.issues) ? item.issues : [item.issues]));
                   } else {
                       result.push(item);
                   }
               });
               return result;
           };

           const flatIssues = flatten(Array.isArray(parsed.issues) ? parsed.issues : [parsed.issues]);
           setIssuesData(flatIssues);
        }
      } catch (error) {
        console.error('Failed to fetch roadmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [unlockAchievement]);

  const groupOrder = useMemo(() => ['In Progress', 'Planned', 'Backlog', 'Completed', 'Cancelled'], []);

  const toggleGroup = (group) => {
    setCollapsedGroups(prev => {
      const newState = { ...prev, [group]: !prev[group] };

      const allCollapsed = groupOrder.every(g => newState[g]);
      if (allCollapsed) {
        unlockAchievement('void_architect');
      }
      return newState;
    });
  };

  const handleIssueClick = (id) => {
      setSearchParams({ issue: id });
  };

  const handleCloseModal = () => {
      setSearchParams({});
  };

  const groupedIssues = useMemo(() => {
    let filtered = issuesData.filter(i =>
        i.title?.toLowerCase().includes(filter.toLowerCase()) ||
        i.id?.toLowerCase().includes(filter.toLowerCase())
    );

    if (statusFilter !== 'All') {
        filtered = filtered.filter(i => {
            const s = i.status?.toLowerCase() || 'backlog';
            if (statusFilter === 'In Progress') return s.includes('progress');
            if (statusFilter === 'Planned') return s.includes('planned') || s.includes('todo');
            if (statusFilter === 'Completed') return s.includes('complet') || s.includes('done');
            if (statusFilter === 'Backlog') return s.includes('backlog') || s.includes('hold');
            if (statusFilter === 'Cancelled') return s.includes('cancel');
            return true;
        });
    }

    const groups = {
      'In Progress': [],
      'Planned': [],
      'Backlog': [],
      'Completed': [],
      'Cancelled': []
    };

    filtered.forEach(issue => {
      const s = issue.status?.toLowerCase() || 'backlog';
      if (s.includes('progress')) groups['In Progress'].push(issue);
      else if (s.includes('planned') || s.includes('todo')) groups['Planned'].push(issue);
      else if (s.includes('complet') || s.includes('done')) groups['Completed'].push(issue);
      else if (s.includes('cancel')) groups['Cancelled'].push(issue);
      else groups['Backlog'].push(issue);
    });

    return groups;
  }, [issuesData, filter, statusFilter]);

  const statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Planned', value: 'Planned' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Backlog', value: 'Backlog' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const viewOptions = [
    { label: 'List View', value: 'list' },
    { label: 'Board View', value: 'board' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Spinner className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#e5e5e5] font-sans selection:bg-indigo-500/30 relative">
        <Seo
          title="Roadmap | Fezcodex"
          description="Project status and future development tracking."
          keywords={['Fezcodex', 'roadmap', 'linear', 'issues']}
          image="/images/asset/roadmap-page.webp"
        />

        {selectedIssueId && (
            <RoadmapItemModal issueId={selectedIssueId} onClose={handleCloseModal} />
        )}

        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link to="/" className="text-gray-500 hover:text-white transition-colors">
                    <ArrowLeft size={16} weight="bold" />
                </Link>
                <div className="h-4 w-px bg-white/[0.1]" />
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-gray-500">Workhammer</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-200">Fezcodex</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-white">Roadmap</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <div className="flex bg-white/[0.05] p-0.5 rounded-[6px] border border-white/[0.05]">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-[4px] transition-all ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        title="List View"
                    >
                        <ListDashes size={14} weight="bold" />
                    </button>
                    <button
                         onClick={() => setViewMode('board')}
                         className={`p-1.5 rounded-[4px] transition-all ${viewMode === 'board' ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                         title="Board View"
                    >
                        <Rows size={14} weight="bold" className="rotate-90" />
                    </button>
                 </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 border-b border-white/[0.04]">
             <div className="relative group grow max-w-md">
                <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search issues..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/[0.06] rounded-[6px] py-1.5 pl-9 pr-3 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.05] transition-all"
                                />
                             </div>
             <div className="flex items-center gap-2">
                 <CustomDropdown
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    label="Filter"
                    icon={Funnel}
                    variant="brutalist"
                    className="min-w-[140px]"
                 />
                 <CustomDropdown
                    options={viewOptions}
                    value={viewMode}
                    onChange={setViewMode}
                    label="View"
                    icon={Eye}
                    variant="brutalist"
                    className="min-w-[140px]"
                 />
             </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-x-auto min-h-[calc(100vh-140px)]">
            {viewMode === 'board' ? (
                <div className="flex gap-6 min-w-max pb-12">
                    {groupOrder.map(group => {
                        const issues = groupedIssues[group];
                        const isCollapsed = collapsedGroups[group];
                        if (issues.length === 0 && group === 'Cancelled') return null;

                        return (
                            <div key={group} className={`shrink-0 transition-all duration-300 ${isCollapsed ? 'w-[50px]' : 'w-[300px]'}`}>
                                {isCollapsed ? (
                                    <div
                                        onClick={() => toggleGroup(group)}
                                        className="h-full border-r border-white/5 flex flex-col items-center py-4 cursor-pointer hover:bg-white/[0.02]"
                                        title={`Expand ${group}`}
                                    >
                                         <div className="writing-mode-vertical text-xs font-mono font-medium text-gray-500 tracking-widest uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                            {group} <span className="text-gray-700 ml-2">({issues.length})</span>
                                         </div>
                                         <Plus size={14} className="mt-4 text-gray-600" />
                                    </div>
                                ) : (
                                    <>
                                        <GroupHeader
                                            title={group}
                                            count={issues.length}
                                            icon={group === 'In Progress' ? SquareHalfBottom : group === 'Completed' ? CheckCircle : Circle}
                                            isCollapsed={false}
                                            onToggle={() => toggleGroup(group)}
                                        />
                                        <div className="space-y-0 mt-3">
                                            <AnimatePresence>
                                                {issues.map(issue => (
                                                    <IssueCard key={issue.id} issue={issue} viewMode="board" onClick={handleIssueClick} />
                                                ))}
                                            </AnimatePresence>
                                            <button className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-gray-400 text-xs w-full transition-colors group">
                                                <Plus size={14} />
                                                <span>New Issue</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="max-w-5xl mx-auto pb-24">
                    {groupOrder.map(group => {
                         const issues = groupedIssues[group];
                         const isCollapsed = collapsedGroups[group];
                         if (issues.length === 0) return null;

                         return (
                             <div key={group} className="mb-8">
                                 <GroupHeader
                                    title={group}
                                    count={issues.length}
                                    icon={group === 'In Progress' ? SquareHalfBottom : group === 'Completed' ? CheckCircle : Circle}
                                    isCollapsed={isCollapsed}
                                    onToggle={() => toggleGroup(group)}
                                 />
                                 {!isCollapsed && (
                                     <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-1 overflow-hidden"
                                     >
                                         {issues.map(issue => (
                                             <IssueCard key={issue.id} issue={issue} viewMode="list" onClick={handleIssueClick} />
                                         ))}
                                     </motion.div>
                                 )}
                             </div>
                         );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};

export default FezzillaPage;
