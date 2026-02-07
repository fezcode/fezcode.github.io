import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@phosphor-icons/react';

const ProjectCard = ({ project, index, isActive, onHover = () => {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => onHover(project)}
      className="relative mr-4 md:mr-12"
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group relative flex items-center justify-between border-b border-white/10 py-8 pr-12 transition-all duration-300"
      >
        {/* Active Indicator Line */}
        <div
          className={`absolute left-0 top-0 h-full w-1 bg-emerald-400 transition-all duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="flex flex-1 items-baseline gap-6 pl-4 md:pl-8 min-w-0 pr-8">
          {/* Index / Year */}
          <span
            className={`font-mono text-sm flex-shrink-0 transition-colors duration-300 ${
              isActive ? 'text-emerald-400' : 'text-gray-600'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title */}
          <h3
            className={`text-3xl font-light uppercase tracking-tight transition-all duration-300 md:text-5xl break-words leading-[1.1] ${
              isActive
                ? 'translate-x-2 text-white font-medium'
                : 'text-gray-500 group-hover:text-gray-300'
            }`}
          >
            {project.title}
          </h3>
        </div>

        {/* Arrow Interaction */}
        <div
          className={`w-12 flex justify-end transform transition-all duration-300 ${
            isActive
              ? 'translate-x-0 opacity-100 text-emerald-400'
              : '-translate-x-4 opacity-0 text-gray-500'
          }`}
        >
          <ArrowRightIcon size={32} weight="light" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
