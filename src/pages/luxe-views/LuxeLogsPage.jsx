import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, StarIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import piml from 'piml';
import colors from '../../config/colors';
import LuxeArt from '../../components/LuxeArt';

const categories = [
  'Book', 'Movie', 'Video', 'Game', 'Article', 'Music',
  'Series', 'Food', 'Websites', 'Tools', 'Event'
];

const LuxeLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchPromises = categories.map(async (category) => {
          const response = await fetch(`/logs/${category.toLowerCase()}/${category.toLowerCase()}.piml`);
          if (!response.ok) return [];
          const text = await response.text();
          const data = piml.parse(text);
          return data.logs || [];
        });

        const allLogsArrays = await Promise.all(fetchPromises);
        const combinedLogs = allLogsArrays.flat();

        const logsWithId = combinedLogs.map((log, index) => ({
            ...log,
            id: `${log.title}-${log.date}-${index}`,
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

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
    const matchesCategory = activeCategory === 'All' || log.category === activeCategory;
    const matchesSearch = !searchQuery ||
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
                   A repository of consumption. Books, films, tools, and digital artifacts processed and rated.
               </p>

               <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
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
               </div>
           </div>

           <div className="flex gap-2 overflow-x-auto no-scrollbar mt-8 pb-2">
               <button
                  onClick={() => setActiveCategory('All')}
                  className={`px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeCategory === 'All'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/60'
                  }`}
               >
                   All
               </button>
               {categories.map(cat => {
                   const isActive = activeCategory === cat;
                   const color = colors[cat.toLowerCase()] || '#1A1A1A';

                   return (
                       <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                              isActive
                              ? 'text-white border-transparent'
                              : 'text-[#1A1A1A]/60 border-[#1A1A1A]/10 hover:border-current'
                          }`}
                          style={{
                              backgroundColor: isActive ? color : 'transparent',
                              color: !isActive ? undefined : (cat === 'Music' || cat === 'Series' || cat === 'Food' ? 'black' : 'white'),
                              borderColor: !isActive ? undefined : color
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
            <div className="py-32 text-center font-outfit text-[#1A1A1A]/40">Loading Archives...</div>
          ) : (
            filteredLogs.map((log) => {
              const color = colors[log.category.toLowerCase()] || '#1A1A1A';
              return (
                <Link
                  key={log.id}
                  to={`/logs/${log.category.toLowerCase()}/${log.slug}`}
                  className="group relative block border-b border-[#1A1A1A]/5 py-8 transition-all px-6 -mx-6 rounded-sm overflow-hidden"
                >
                  {/* Background Art */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                      <LuxeArt seed={log.title} colorful={false} className="w-full h-full mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                      {/* Metadata Column */}
                      <div className="flex items-center gap-8 md:w-48 shrink-0">
                        <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30 w-16">
                          {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span
                          className="font-outfit text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-full transition-colors text-black"
                          style={{
                              backgroundColor: color,
                              borderColor: color,
                          }}
                        >
                          {log.category}
                        </span>
                      </div>

                      {/* Title Column */}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-playfairDisplay text-2xl md:text-3xl text-[#1A1A1A] group-hover:italic transition-all leading-tight truncate">
                          {log.title}
                        </h2>
                        {log.author && (
                          <p className="font-outfit text-xs text-[#1A1A1A]/40 mt-1 uppercase tracking-wider">
                              {log.author}
                          </p>
                        )}
                    </div>

                    {/* Rating & Action */}
                    <div className="flex items-center justify-between md:justify-end gap-12 md:w-48 shrink-0">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                              key={i}
                              size={12}
                              weight="fill"
                              className={i < (log.rating || 0) ? "text-[#8D4004]" : "text-[#1A1A1A]/10"}
                          />
                        ))}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowUpRightIcon size={20} className="text-[#1A1A1A]/20" />
                      </div>
                    </div>
                </div>
              </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
export default LuxeLogsPage;
