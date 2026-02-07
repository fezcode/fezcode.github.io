import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LightningIcon,
  CircleIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  FireIcon,
  EqualsIcon,
  ArrowDownIcon,
} from '@phosphor-icons/react';
import {
  getStatusClasses,
  getPriorityClasses,
} from '../../utils/roadmapHelpers';

const RoadmapCard = ({ app, index }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Planned':
        return <CircleIcon weight="bold" />;
      case 'In Progress':
        return <ArrowsClockwiseIcon weight="bold" className="animate-spin" />;
      case 'Completed':
        return <CheckCircleIcon weight="bold" />;
      case 'On Hold':
        return <PauseCircleIcon weight="bold" />;
      default:
        return <CircleIcon weight="bold" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return <FireIcon weight="fill" />;
      case 'Medium':
        return <EqualsIcon weight="bold" />;
      case 'Low':
        return <ArrowDownIcon weight="bold" />;
      default:
        return <ArrowDownIcon weight="bold" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index || 0) * 0.05 }}
    >
      <Link to={`/roadmap/${app.id}`} className="block group relative h-full">
        {/* Main Card Container */}
        <div className="relative flex flex-col h-full bg-zinc-950 border border-white/5 p-5 rounded-sm overflow-hidden group-hover:border-emerald-500/50 transition-all duration-500">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 grayscale"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 flex-grow space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 py-0.5 inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest border rounded-sm ${getStatusClasses(app.status || 'Planned')}`}
              >
                {getStatusIcon(app.status || 'Planned')}
                {app.status || 'Planned'}
              </span>
              <span
                className={`px-2 py-0.5 inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest border rounded-sm ${getPriorityClasses(app.priority || 'Low')}`}
              >
                {getPriorityIcon(app.priority || 'Low')}
                {app.priority || 'Low'}
              </span>
            </div>

            {app.epic && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-purple-500/5 border border-purple-500/20 text-purple-400 text-[9px] font-mono uppercase tracking-[0.2em] font-black">
                <LightningIcon weight="fill" size={10} />
                {app.epic}
              </div>
            )}

            <h4 className="text-lg font-bold font-sans uppercase text-white tracking-tight group-hover:text-emerald-400 transition-colors leading-tight">
              {app.title}
            </h4>
            <p className="text-gray-500 font-sans text-xs leading-relaxed line-clamp-2">
              {app.description}
            </p>
          </div>

          {app.notes && (
            <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
              <p className="text-[10px] font-mono text-gray-600 line-clamp-1 uppercase tracking-widest">
                <span className="text-emerald-500/50 font-black mr-2">
                  LOG:
                </span>
                {app.notes}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default RoadmapCard;
