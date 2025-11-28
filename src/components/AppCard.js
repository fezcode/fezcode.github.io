import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { appIcons } from '../utils/appIcons';

const AppCard = ({ app }) => {
  const { to, title, description } = app;
  const Icon = appIcons[app.icon];

  return (
    <Link to={to} className="block h-full group">
      <div className="relative h-full p-6 bg-gray-800/40 border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-500/50 flex flex-col">
        {/* Gradient Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-primary-500 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gray-700/50 text-primary-400 group-hover:text-white group-hover:bg-primary-500 transition-colors duration-300">
              {Icon && <Icon size={32} weight="duotone" />}
            </div>
            <h3 className="text-xl font-semilight font-mono text-gray-100 group-hover:text-white transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed flex-grow font-sans">
            {description}
          </p>

          <div className="mt-6 flex items-center text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors font-mono">
            Launch App{' '}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AppCard;
