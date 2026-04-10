import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  StarIcon,
  ArrowUpRightIcon,
  GridFourIcon,
  ListBulletsIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import piml from 'piml';
import colors from '../../config/colors';
import LuxeArt from '../../components/LuxeArt';

const categories = [
  'Book',
  'Movie',
  'Video',
  'Game',
  'Article',
  'Music',
  'Series',
  'Food',
  'Websites',
  'Tools',
  'Event',
];

const LuxeLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('list');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchPromises = categories.map(async (category) => {
          const response = await fetch(
            `/logs/${category.toLowerCase()}/${category.toLowerCase()}.piml`,
          );
          if (!response.ok) return [];
          const text = await response.text();
          const data = piml.parse(text);
          return data.logs || [];
        });

        const allLogsArrays = await Promise.all(fetchPromises);
        const combinedLogs = allLogsArrays.flat();

        const logsWithId = combinedLogs
          .map((log, index) => ({
            ...log,
            id: `${log.title}-${log.date}-${index}`,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setLogs(logsWithId);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesCategory =
      activeCategory === 'All' || log.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo title="Fezcodex | Logs" description="Digital Archives." />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">
          <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            The Archives
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
              A repository of consumption. Books, films, tools, and digital
              artifacts processed and rated.
            </p>

            <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto items-end">
              <div className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search Archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
                />
                <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
              </div>

              {/* Layout Switcher */}
              <div className="hidden md:flex bg-white rounded-full p-1 border border-[#1A1A1A]/5 shadow-sm ml-4">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-2 rounded-full transition-all ${layoutMode === 'grid' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'}`}
                  title="Grid View"
                >
                  <GridFourIcon size={18} />
                </button>
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`p-2 rounded-full transition-all ${layoutMode === 'list' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'}`}
                  title="List View"
                >
                  <ListBulletsIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-8 pb-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === 'All'
                  ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10'
                  : 'border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/60'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const color = colors[cat.toLowerCase()] || '#1A1A1A';

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                    isActive
                      ? 'text-white border-transparent shadow-lg'
                      : 'text-[#1A1A1A]/60 border-[#1A1A1A]/10 hover:border-[#1A1A1A]'
                  }`}
                  style={{
                    backgroundColor: isActive ? color : 'transparent',
                    color: !isActive
                      ? undefined
                      : cat === 'Music' || cat === 'Series' || cat === 'Food'
                        ? 'black'
                        : 'white',
                    borderColor: !isActive ? undefined : color,
                    boxShadow: isActive ? `0 4px 14px 0 ${color}40` : 'none'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        <div className="space-y-0">
          {loading ? (
            <div className="py-32 text-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-[0.2em] animate-pulse">
              Loading Archives...
            </div>
          ) : layoutMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredLogs.map((log) => {
                const color = colors[log.category.toLowerCase()] || '#1A1A1A';
                return (
                  <Link
                    key={log.id}
                    to={`/logs/${log.category.toLowerCase()}/${log.slug}`}
                    className="group relative block aspect-square bg-white rounded-xl overflow-hidden border border-[#1A1A1A]/5 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none overflow-hidden rounded-xl">
                      <LuxeArt seed={log.title} colorful={true} className="w-full h-full mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                         <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">
                           {new Date(log.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                         </span>
                         <span className="font-outfit text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded flex items-center transition-colors" style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
                           {log.category}
                         </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center text-center">
                         <h2 className="font-playfairDisplay text-2xl md:text-3xl text-[#1A1A1A] group-hover:scale-105 transition-transform duration-500 leading-tight">
                           {log.title}
                         </h2>
                         {log.author && (
                           <p className="font-outfit text-[10px] text-[#1A1A1A]/40 mt-2 uppercase tracking-[0.2em]">
                             {log.author}
                           </p>
                         )}
                      </div>
                      <div className="flex justify-between items-end">
                         <div className="flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                             <StarIcon key={i} size={12} weight="fill" className={i < (log.rating || 0) ? 'text-[#8D4004]' : 'text-[#1A1A1A]/10'} />
                           ))}
                         </div>
                         <div className="w-8 h-8 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                           <ArrowUpRightIcon size={14} />
                         </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto flex flex-col gap-4 animate-fade-in">
              {filteredLogs.map((log) => {
                const color = colors[log.category.toLowerCase()] || '#1A1A1A';
                return (
                  <Link
                    key={log.id}
                    to={`/logs/${log.category.toLowerCase()}/${log.slug}`}
                    className="group relative block border border-[#1A1A1A]/5 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center p-6 gap-6 md:gap-8">
                      <div className="flex items-center gap-6 w-full md:w-48 shrink-0">
                        <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 w-16">
                          {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="font-outfit text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded transition-colors text-black" style={{ backgroundColor: color, borderColor: color }}>
                          {log.category}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                           <h2 className="font-playfairDisplay text-xl md:text-2xl text-[#1A1A1A] group-hover:italic transition-all leading-tight truncate">
                             {log.title}
                           </h2>
                           {log.author && (
                             <p className="font-outfit text-[10px] text-[#1A1A1A]/40 uppercase tracking-[0.2em] truncate">
                               — {log.author}
                             </p>
                           )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-48 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#1A1A1A]/5">
                         <div className="flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                             <StarIcon key={i} size={12} weight="fill" className={i < (log.rating || 0) ? 'text-[#8D4004]' : 'text-[#1A1A1A]/10'} />
                           ))}
                         </div>
                         <div className="w-8 h-8 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                           <ArrowUpRightIcon size={14} />
                         </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LuxeLogsPage;
