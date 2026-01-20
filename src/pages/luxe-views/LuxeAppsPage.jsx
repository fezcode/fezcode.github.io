import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ArrowUpRightIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import LuxeArt from '../../components/LuxeArt';

const categoryColors = {
  Games: '#5B21B6', // Deep Amethyst
  'Whimsical Tools': '#BE185D', // Crimson Rose
  Generators: '#047857', // Emerald Spruce
  Converters: '#1D4ED8', // Royal Sapphire
  Utilities: '#374151', // Charcoal Slate
  Education: '#B45309', // Burnished Amber
  Tools: '#457B9D',
  Visuals: '#A8DADC',
  Audio: '#FFB703',
  Design: '#FB8500',
  Code: '#219EBC',
  Default: '#1A1A1A',
};

const LuxeAppsPage = () => {
  const [apps, setApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/apps/apps.json')
      .then((response) => response.json())
      .then((data) => {
        const flattenedApps = [];
        const cats = ['All'];
        Object.keys(data).forEach((categoryKey) => {
          if (categoryKey !== 'Bests') {
            cats.push(data[categoryKey].name);
            data[categoryKey].apps.forEach((app) => {
              flattenedApps.push({
                ...app,
                categoryName: data[categoryKey].name,
                name: app.title,
                path: app.to,
                id: app.slug,
              });
            });
          }
        });
        setApps(flattenedApps);
        setAvailableCategories(cats);
      })
      .catch((error) => console.error('Error fetching apps:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredApps = apps.filter((app) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query);
    const matchesCategory =
      activeCategory === 'All' || app.categoryName === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo title="Fezcodex | Apps" description="Software Tools." />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <header className="mb-12 pt-12 border-b border-[#1A1A1A]/10 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-black/40 hover:text-[#8D4004] transition-colors"
          >
            <ArrowLeftIcon /> Home
          </Link>
          <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            Software
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
              Functional utilities, interactive experiments, and digital toys.
              Every module is a synthesis of logic and aesthetic.
            </p>

            <div className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors min-w-[300px]">
              <input
                type="text"
                placeholder="Search Apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
              />
              <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
            </div>
          </div>
        </header>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-20 pb-4 border-b border-[#1A1A1A]/5">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-outfit text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white shadow-lg'
                  : 'bg-white/50 text-[#1A1A1A]/40 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-32 text-center font-outfit text-[#1A1A1A]/40 uppercase tracking-widest">
            Connecting to Application Registry...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {filteredApps.map((app) => {
              const categoryColor =
                categoryColors[app.categoryName] || categoryColors.Default;
              const Icon = appIcons[app.icon] || appIcons[`${app.icon}Icon`];

              return (
                <Link key={app.id} to={app.path} className="group block h-full">
                  <div className="relative aspect-square w-full bg-[#EBEBEB] overflow-hidden mb-8 border border-[#1A1A1A]/5 shadow-sm group-hover:shadow-2xl transition-all duration-700 rounded-sm">
                    {/* Art/Image with Category Overlay */}
                    <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                      <LuxeArt
                        seed={app.name}
                        className="w-full h-full opacity-80 mix-blend-multiply"
                      />
                      <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                        style={{ backgroundColor: categoryColor }}
                      />
                    </div>

                    <div
                      className="absolute top-6 left-6 w-16 h-16 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-[#1A1A1A]/5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-500"
                      style={{ color: categoryColor }}
                    >
                      {Icon && <Icon size={28} weight="light" />}
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#1A1A1A] text-white p-4 rounded-full">
                      <ArrowUpRightIcon size={24} />
                    </div>
                  </div>

                  <div className="space-y-3 px-2">
                    <span
                      className="font-outfit text-[10px] uppercase tracking-widest"
                      style={{ color: categoryColor }}
                    >
                      {app.categoryName}
                    </span>
                    <h2 className="font-playfairDisplay text-3xl text-[#1A1A1A] group-hover:italic transition-all leading-tight">
                      {app.name}
                    </h2>
                    <p className="font-outfit text-sm text-[#1A1A1A]/60 line-clamp-2 leading-relaxed italic">
                      {app.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxeAppsPage;
