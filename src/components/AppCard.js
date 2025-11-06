import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import colors from '../config/colors';

const AppCard = ({ app }) => {
  const { to, title, description } = app;

  const cardStyle = {
    backgroundColor: colors['article-alpha-10'],
    borderColor: colors['article-alpha-50'],
    color: colors.article,
  };

  const detailTextColor = colors['article-light'];

  return (
    <Link to={to} className="block h-full">
      <div
        className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full"
        style={cardStyle}
      >
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 group-hover:opacity-0 transition-opacity duration-500 ease-in-out"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-in-out"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)',
            backgroundSize: '15px 15px',
          }}
        ></div>
        <div>
          <h2 className="text-xl font-normal transition-colors" style={{ color: cardStyle.color }}>{title}</h2>
          <p className="mt-2" style={{ color: detailTextColor }}>{description}</p>
        </div>
        <div className="flex justify-end items-center mt-4">
          <ArrowRight size={24} className="transition-colors" style={{ color: detailTextColor }} />
        </div>
      </div>
    </Link>
  );
};

export default AppCard;
