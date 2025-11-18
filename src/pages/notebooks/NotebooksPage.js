import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotebookCover from './NotebookCover';
import useSeo from '../../hooks/useSeo';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import piml from 'piml';

const NotebooksPage = () => {
  useSeo({
    title: 'Notebooks | Fezcodex',
    description: 'Explore a collection of my personal notebooks and thoughts.',
    keywords: ['Fezcodex', 'notebooks', 'thoughts', 'journal'],
    ogTitle: 'Notebooks | Fezcodex',
    ogDescription:
      'Explore a collection of my personal notebooks and thoughts.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Notebooks | Fezcodex',
    twitterDescription:
      'Explore a collection of my personal notebooks and thoughts.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/notebooks/notebooks.piml')
      .then((response) => response.text())
      .then((pimlText) => {
        const data = piml.parse(pimlText);
        setNotebooks(data.notebooks);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notebooks:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4 mx-auto"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4 mx-auto"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg shadow-lg p-6 h-64"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            to="/"
            className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
          >
            <ArrowLeftIcon className="text-xl" /> Back to Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            My <span style={{ color: 'var(--fzcdx-spanner)' }}>Notebooks</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A collection of my thoughts, notes, and explorations.
          </p>
          <div className="mt-4 text-center">
            <span className="ml-2 px-3 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">
              Total: {notebooks.length}
            </span>
          </div>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notebooks.map((notebook) => (
              <Link key={notebook.id} to={`/notebooks/${notebook.id}`}>
                <NotebookCover
                  title={notebook.title}
                  backgroundColor={notebook.backgroundColor}
                  fontFamily={notebook.fontFamily}
                  textColor={notebook.textColor}
                  hoverBackgroundColor={notebook.hoverBackgroundColor}
                  hoverTextColor={notebook.hoverTextColor}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebooksPage;
