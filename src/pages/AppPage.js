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
  {
    to: '/apps/base64-converter',
    title: 'Base64 Converter',
    description: 'Encode and decode text to and from Base64 format.',
  },
  {
    to: '/apps/url-converter',
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URL strings.',
  },
  {
    to: '/apps/ascii-converter',
    title: 'Text to ASCII Converter',
    description: 'Convert text to ASCII codes and vice-versa.',
  },
  {
    to: '/apps/hash-generator',
    title: 'Hash Generator',
    description: 'Generate SHA1, SHA256, and SHA512 hashes from text.',
  },
  {
    to: '/apps/uuid-generator',
    title: 'UUID Generator',
    description: 'Generate UUID v4.',
  },
  {
    to: '/apps/color-palette-generator',
    title: 'Color Palette Generator',
    description: 'Generate random color palettes.',
  },
  {
    to: '/apps/css-unit-converter',
    title: 'CSS Unit Converter',
    description: 'Convert between px, em, rem, vw, vh, and % units.',
  },
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
