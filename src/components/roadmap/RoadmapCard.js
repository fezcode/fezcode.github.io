import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KanbanIcon } from '@phosphor-icons/react'; // Using KanbanIcon as a default/watermark icon
import { getStatusClasses, getPriorityClasses, statusTextColor } from '../../utils/roadmapHelpers';

const RoadmapCard = ({ app, index }) => {
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
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getStatusClasses(app.status || 'Planned')} ${statusTextColor(app.status || 'Planned')}`}
              >
                {app.status || 'Planned'}
              </span>
              <span
                className={`px-2 py-0 inline-flex text-xs font-mono font-semibold rounded-md shadow-sm border ${getPriorityClasses(app.priority || 'Low')}`}
              >
                {app.priority || 'Low'}
              </span>
            </div>
            <h4 className="text-xl font-bold font-mono text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors">
              {app.title}
            </h4>
            <p className="text-gray-400 font-mono text-sm leading-relaxed line-clamp-3">
              {app.description}
            </p>
          </div>

          {app.notes && (
            <div className="relative z-10 mt-3 pt-3 border-t border-gray-700">
              <p className="text-gray-500 text-xs italic line-clamp-2">
                Notes: {app.notes}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default RoadmapCard;
