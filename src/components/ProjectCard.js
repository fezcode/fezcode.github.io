import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CaretRight } from '@phosphor-icons/react';

const ProjectCard = ({ project, index, isActive, onHover = () => {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => onHover(project)}
      className="relative"
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group relative flex items-center justify-between border-b border-white/10 py-8 pr-4 transition-all duration-300"
      >
        {/* Active Indicator Line */}
        <div
          className={`absolute left-0 top-0 h-full w-1 bg-cyan-400 transition-all duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="flex items-baseline gap-6 pl-4 md:pl-8">
          {/* Index / Year */}
          <span
            className={`font-mono text-sm transition-colors duration-300 ${
              isActive ? 'text-cyan-400' : 'text-gray-600'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title */}
          <h3
            className={`text-3xl font-light uppercase tracking-tight transition-all duration-300 md:text-5xl ${
              isActive
                ? 'translate-x-4 text-white font-medium'
                : 'text-gray-500 group-hover:text-gray-300'
            }`}
          >
            {project.title}
          </h3>
        </div>

        {/* Arrow Interaction */}
        <div
          className={`transform transition-all duration-300 ${
            isActive
              ? 'translate-x-0 opacity-100 text-cyan-400'
              : '-translate-x-4 opacity-0 text-gray-500'
          }`}
        >
          <ArrowRight size={32} weight="light" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
