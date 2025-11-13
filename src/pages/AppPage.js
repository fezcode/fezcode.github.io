import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CaretDown, CaretRight } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import AppCard from '../components/AppCard';
import useSeo from "../hooks/useSeo";
import { appIcons } from '../utils/appIcons'; // Import appIcons

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

  const [groupedApps, setGroupedApps] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});

  useEffect(() => {
    fetch('/apps/apps.json')
      .then((response) => response.json())
      .then((data) => {
        setGroupedApps(data);
        const initialCollapsedState = Object.keys(data).reduce((acc, categoryKey) => {
          acc[categoryKey] = false;
          return acc;
        }, {});
        setCollapsedCategories(initialCollapsedState);
      })
      .catch((error) => console.error('Error fetching apps:', error));
  }, []);

  const toggleCategoryCollapse = (categoryKey) => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [categoryKey]: !prevState[categoryKey]
    }));
  };

  const variants = {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 }
  };

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
        {Object.keys(groupedApps)
          .sort((a, b) => groupedApps[a].order - groupedApps[b].order)
          .map(categoryKey => {
            const category = groupedApps[categoryKey];
            const CategoryIcon = appIcons[category.icon];
            return (
              <div key={categoryKey} className="mt-8">
                <h2
                  className="text-3xl font-arvo font-normal tracking-tight text-gray-200 mb-2 flex items-center cursor-pointer"
                  onClick={() => toggleCategoryCollapse(categoryKey)}
                >
                  {collapsedCategories[categoryKey] ? <CaretRight size={24} className="mr-2" /> : <CaretDown size={24} className="mr-2" />}
                  {CategoryIcon && <CategoryIcon size={28} className="mr-2" />}
                  {category.name} ({category.apps.length})
                </h2>
                <p className="text-gray-400 mb-4 ml-10">{category.description}</p>
                <AnimatePresence initial={false}>
                  {!collapsedCategories[categoryKey] && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={variants}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {category.apps.map((app, index) => (
                          <AppCard key={index} app={app} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AppPage;
