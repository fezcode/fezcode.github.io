import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CalendarBlank,
  CheckCircle,
  Circle,
  CircleDashed,
  DotsThree,
  SquareHalfBottom,
  Tag,
  User,
  XCircle,
} from '@phosphor-icons/react';
import piml from 'piml';

// Reuse Status Icons (Should be shared, but inlining for speed)
const StatusIcon = ({ status, className = '' }) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
      return (
        <CheckCircle weight="fill" className={`text-indigo-400 ${className}`} />
      );
    case 'in progress':
      return (
        <SquareHalfBottom
          weight="fill"
          className={`text-amber-400 ${className}`}
        />
      );
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

const PriorityIcon = ({ priority, className = '' }) => {
  switch (priority?.toLowerCase()) {
    case 'high':
    case 'urgent':
      return (
        <div className={`flex gap-0.5 items-end ${className}`}>
          <div className="w-1 h-1.5 bg-red-500 rounded-[1px]" />
          <div className="w-1 h-2.5 bg-red-500 rounded-[1px]" />
          <div className="w-1 h-3.5 bg-red-500 rounded-[1px]" />
        </div>
      );
    case 'medium':
      return (
        <div className={`flex gap-0.5 items-end ${className}`}>
          <div className="w-1 h-1.5 bg-orange-400 rounded-[1px]" />
          <div className="w-1 h-2.5 bg-orange-400 rounded-[1px]" />
          <div className="w-1 h-3.5 bg-white/20 rounded-[1px]" />
        </div>
      );
    case 'low':
      return (
        <div className={`flex gap-0.5 items-end ${className}`}>
          <div className="w-1 h-1.5 bg-gray-400 rounded-[1px]" />
          <div className="w-1 h-2.5 bg-white/20 rounded-[1px]" />
          <div className="w-1 h-3.5 bg-white/20 rounded-[1px]" />
        </div>
      );
    default:
      return <DotsThree className={`text-gray-600 ${className}`} />;
  }
};

const RoadmapItemModal = ({ issueId, onClose }) => {
  const [roadmapItem, setRoadmapItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!issueId) return;

    const fetchRoadmapItem = async () => {
      setIsLoading(true);
      try {
        const pimlResponse = await fetch('/roadmap/roadmap.piml');
        if (!pimlResponse.ok) throw new Error('Failed to load');

        const issuesPimlText = await pimlResponse.text();
        const parsed = piml.parse(issuesPimlText);

        let allIssues = [];
        let data = parsed.issues || [];

        const flatten = (items) => {
          let result = [];
          const list = Array.isArray(items) ? items : [items];
          list.forEach((item) => {
            if (item.issues) {
              result = result.concat(flatten(item.issues));
            } else {
              result.push(item);
            }
          });
          return result;
        };

        allIssues = flatten(data);
        const foundItem = allIssues.find((item) => item.id === issueId);
        setRoadmapItem(foundItem);
      } catch (error) {
        console.error('Failed to fetch item', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapItem();
  }, [issueId]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          className="relative w-full max-w-5xl bg-[#121212] border border-white/[0.08] rounded-lg shadow-2xl shadow-black/80 flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-transparent hover:bg-white/10 rounded-md transition-colors z-20"
          >
            <X size={18} />
          </button>

          {isLoading ? (
            <div className="w-full h-96 flex items-center justify-center text-gray-500 font-mono text-xs">
              Loading Artifact...
            </div>
          ) : !roadmapItem ? (
            <div className="w-full h-96 flex flex-col items-center justify-center text-gray-500 font-mono text-xs gap-4">
              <span>Artifact Not Found</span>
              <button onClick={onClose} className="text-white underline">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Left: Content */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar border-r border-white/[0.06]">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-6">
                  <span>{roadmapItem.id}</span>
                  {roadmapItem.epic && (
                    <>
                      <span>/</span>
                      <span>{roadmapItem.epic}</span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-6">
                  {roadmapItem.title}
                </h2>

                <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-200 max-w-none text-[15px] leading-relaxed mb-12">
                  <p>{roadmapItem.description}</p>
                </div>

                {roadmapItem.notes && (
                  <div className="pt-8 border-t border-white/[0.06]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                      Activity Log
                    </h3>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/30">
                        <User size={14} weight="fill" />
                      </div>
                      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/[0.04] text-sm text-gray-300 grow relative">
                        {/* Triangle pointer */}
                        <div className="absolute top-3 -left-1.5 w-3 h-3 bg-[#1a1a1a] border-l border-b border-white/[0.04] rotate-45" />
                        {roadmapItem.notes}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div className="w-full md:w-80 bg-[#0f0f0f] p-8 space-y-8 overflow-y-auto border-l border-white/[0.02]">
                <div className="space-y-6">
                  <SidebarItem label="Status">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-200 bg-white/[0.06] px-2 py-1 rounded w-fit">
                      <StatusIcon
                        status={roadmapItem.status}
                        className="w-3.5 h-3.5"
                      />
                      <span>{roadmapItem.status || 'Planned'}</span>
                    </div>
                  </SidebarItem>

                  <SidebarItem label="Priority">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
                      <PriorityIcon priority={roadmapItem.priority} />
                      <span>{roadmapItem.priority || 'None'}</span>
                    </div>
                  </SidebarItem>

                  <SidebarItem label="Assignee">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          (roadmapItem.assignee || 'Fezcodex')
                            .toLowerCase()
                            .includes('gemini')
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-gray-800 border-white/10 text-gray-400'
                        }`}
                      >
                        {(roadmapItem.assignee || 'Fezcodex')
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span>{roadmapItem.assignee || 'Fezcodex'}</span>
                    </div>
                  </SidebarItem>

                  {roadmapItem.category && (
                    <SidebarItem label="Labels">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-white/[0.05] text-gray-400 border border-white/[0.05] text-[11px]">
                        <Tag size={12} weight="fill" />
                        {roadmapItem.category}
                      </span>
                    </SidebarItem>
                  )}

                  {roadmapItem.due_date && (
                    <SidebarItem label="Due Date">
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <CalendarBlank size={14} />
                        {new Date(roadmapItem.due_date).toLocaleDateString()}
                      </span>
                    </SidebarItem>
                  )}
                </div>

                <div className="pt-8 border-t border-white/[0.06] space-y-2">
                  <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase tracking-wider">
                    <span>Created</span>
                    <span>
                      {new Date(roadmapItem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase tracking-wider">
                    <span>Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SidebarItem = ({ label, children }) => (
  <div className="space-y-2">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
      {label}
    </span>
    <div>{children}</div>
  </div>
);

export default RoadmapItemModal;
