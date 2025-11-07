import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import AppCard from '../components/AppCard';
import usePageTitle from '../utils/usePageTitle';

const apps = [
  {
    to: '/apps/tournament-bracket',
    title: 'Tournament Bracket',
    description: 'Create and manage tournament brackets.',
  },
  {
    to: '/apps/word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, lines and paragraphs in a text.',
  },
  {
    to: '/apps/case-converter',
    title: 'Case Converter',
    description: 'Convert text to different cases (e.g., uppercase, lowercase, camelCase).',
  },
  // {
  //   to: '/apps/ip',
  //   title: 'Show my IP',
  //   description: 'Display your public IP address.',
  // },
];

function AppPage() {
  usePageTitle('Apps');

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/"
          className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {apps.map((app, index) => (
            <AppCard key={index} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppPage;
