import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import GenerativeArt from './GenerativeArt';

const ProjectTile = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-zinc-900 border border-white/10"
    >
      <Link to={`/projects/${project.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <GenerativeArt
            seed={project.title}
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Overlay Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-white bg-black/50 backdrop-blur-md rounded border border-white/10">
              {project.slug.split('-')[0]}
            </span>
          </div>

          {/* Hover Button */}
          <div className="absolute top-3 right-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg">
              <ArrowUpRight weight="bold" size={16} />
            </div>
          </div>
        </div>

        {/* Content */}

        <div className="flex flex-col flex-grow p-5">
          <h3 className="text-xl font-medium font-sans uppercase text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-grow font-arvo">
            {' '}
            {project.shortDescription}
          </p>

          {/* Tech Stack */}

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies &&
              project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono text-gray-500 uppercase tracking-wider border border-white/10 px-1.5 py-0.5 rounded group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-colors"
                >
                  {tech}
                </span>
              ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectTile;
