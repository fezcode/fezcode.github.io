import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  KanbanIcon,
  Lightning,
  Circle,
  ArrowsClockwise,
  CheckCircle,
  PauseCircle,
  Fire,
  Equals,
  ArrowDown,
} from '@phosphor-icons/react';
import {
  getStatusClasses,
  getPriorityClasses,
} from '../../utils/roadmapHelpers';

const RoadmapCard = ({ app, index }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/roadmap/${app.id}`} className="block group relative h-full">
        {/* Main Card Container */}
        <div className="relative flex flex-col h-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-4 overflow-hidden group-hover:border-primary-500 transition-all duration-300 shadow-xl">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>
          {/* Watermark Icon */}
          <div className="absolute -bottom-6 -right-6 text-gray-700 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 rotate-12 pointer-events-none z-0">
            <KanbanIcon size={120} weight="fill" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex-grow">
            <div className="flex items-center justify-between mb-3 gap-2">
              <span
                className={`px-2 py-0.5 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md shadow-sm ${getStatusClasses(app.status || 'Planned')}`}
              >
                {getStatusIcon(app.status || 'Planned')}
                {app.status || 'Planned'}
              </span>
              <span
                className={`px-2 py-0.5 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md shadow-sm ${getPriorityClasses(app.priority || 'Low')}`}
              >
                {getPriorityIcon(app.priority || 'Low')}
                {app.priority || 'Low'}
              </span>
            </div>

            {app.epic && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] font-mono uppercase tracking-wider font-bold w-fit">
                <Lightning weight="fill" size={12} />
                {app.epic}
              </div>
            )}

            <h4 className="text-xl font-bold font-mono text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors">
              {app.title}
            </h4>
            <p className="text-gray-400 font-mono text-sm leading-relaxed line-clamp-3">
              {app.description}
            </p>
          </div>

          {app.notes && (
            <div className="relative z-10 mt-4 bg-black/20 rounded-lg p-3 border border-white/5">
              <p className="text-gray-500 text-xs italic line-clamp-2 font-mono">
                <span className="font-bold text-gray-400 not-italic mr-2">
                  NOTE:
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
