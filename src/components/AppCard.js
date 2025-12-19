import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import GenerativeArt from './GenerativeArt';
import { appIcons } from '../utils/appIcons';

const AppCard = ({ app }) => {
  const { to, title, description, icon, pinned_order } = app;
  const Icon = appIcons[icon];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-zinc-900 border border-white/10 h-full"
    >
      <Link to={to} className="flex flex-col h-full">
        {/* Visual Header */}
        <div className="relative h-32 w-full overflow-hidden border-b border-white/5">
          <GenerativeArt
            seed={title + (icon || 'app')}
            className="w-full h-full opacity-40 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

          {/* Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-emerald-400 transform group-hover:scale-110 transition-transform duration-500">
              {Icon && <Icon size={32} weight="duotone" />}
            </div>
          </div>

          {/* Pinned Badge */}
          {pinned_order && (
            <div className="absolute top-3 right-3 text-yellow-400 drop-shadow-md">
              <Star weight="fill" size={18} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          <h3 className="text-lg font-medium font-sans uppercase text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-1 leading-tight tracking-tight">
            {title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-grow font-sans">
            {description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
              Open App
            </span>
            <ArrowRight
              weight="bold"
              size={14}
              className="text-emerald-500 transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AppCard;
