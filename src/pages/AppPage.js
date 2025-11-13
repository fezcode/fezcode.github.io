import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import AppCard from '../components/AppCard';
import useSeo from "../hooks/useSeo";

function AppPage() {
  useSeo({
    title: 'Apps | Fezcodex',
    description: 'All the available apps created within the Fezcodex.',
    keywords: ['Fezcodex', 'apps', 'applications', 'blog', 'dev', 'rant', 'series', 'd&d'],
    ogTitle: 'Apps | Fezcodex',
    ogDescription: 'All the available apps created within the Fezcodex.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Apps | Fezcodex',
    twitterDescription: 'All the available apps created within the Fezcodex.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch('/apps/apps.json')
      .then((response) => response.json())
      .then((data) => setApps(data))
      .catch((error) => console.error('Error fetching apps:', error));
  }, []);

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
