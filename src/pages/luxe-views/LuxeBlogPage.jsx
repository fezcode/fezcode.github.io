import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ListBulletsIcon,
  GridFourIcon,
  FolderIcon,
} from '@phosphor-icons/react';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'ai', label: 'AI' },
  { id: 'feat', label: 'Feat' },
  { id: 'rant', label: 'Rant' },
  { id: 'essay', label: 'Essay' },
  { id: 'series', label: 'Series' },
  { id: 'gist', label: 'Gist' },
  { id: 'd&d', label: 'D&D' },
];

const LuxeBlogPage = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('grid');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();
        // Flatten series for the index, or keep them?
        // For Luxe, individual posts usually look better in a grid.
        // But let's respect the grouping if possible.
        // Actually, let's flatten for a pure chronological feed.

        // Wait, the original BlogPage groups them. Let's keep individual posts for simplicity and "clean" feed.
        // Or copy the logic exactly. Let's copy the logic.
        const seriesMap = new Map();
        const individualPosts = [];

        processedPosts.forEach((post) => {
          if (post.series) {
            if (!seriesMap.has(post.series.slug)) {
              seriesMap.set(post.series.slug, {
                title: post.series.title,
                slug: post.series.slug,
                date: post.series.date || post.date,
                updated: post.series.updated || post.updated,
                image: post.series.image,
                isSeries: true,
                posts: [],
                tags: post.tags,
                category: post.category,
                description: post.series.description || post.description,
              });
            }
            seriesMap.get(post.series.slug).posts.push(post);
          } else {
            individualPosts.push(post);
          }
        });

        const combinedItems = [
          ...Array.from(seriesMap.values()),
          ...individualPosts,
        ];
        combinedItems.sort(
          (a, b) =>
            new Date(b.updated || b.date) - new Date(a.updated || a.date),
        );

        setDisplayItems(combinedItems);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredItems = displayItems.filter((item) => {
    const matchesFilter =
      activeFilter === 'all' ||
      item.category === activeFilter ||
      (activeFilter === 'series' && item.isSeries);
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo title="Fezcodex | Journal" description="Archive of thoughts." />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">
          <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            The Journal
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
              A curated collection of engineering notes, architectural
              decisions, and digital essays.
            </p>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
              {/* Search */}
              <div className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
                />
                <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 md:flex-none">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeFilter === f.id
                        ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10'
                        : 'border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/60'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Layout Switcher */}
              <div className="flex bg-white rounded-full p-1 border border-[#1A1A1A]/5 shadow-sm">
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
        </header>

        {/* Content Area */}
        {loading ? (
          <div className="py-32 text-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-[0.2em] animate-pulse">
            Synchronizing Archive...
          </div>
        ) : layoutMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredItems.map((item) => (
              <Link
                key={item.slug}
                to={
                  item.isSeries
                    ? `/blog/series/${item.slug}`
                    : `/blog/${item.slug}`
                }
                className="block h-full group"
              >
                <div className="relative aspect-[3/4] md:aspect-[4/5] w-full bg-white rounded-xl overflow-hidden border border-[#1A1A1A]/5 flex flex-col shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="p-6 md:p-8 border-b border-[#1A1A1A]/5 flex justify-between items-center bg-[#FAFAF8] z-10">
                    <span className="font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/50">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 border border-[#1A1A1A]/10 px-2 py-1 rounded flex items-center gap-1">
                      {item.isSeries && <FolderIcon size={10} weight="fill" />}
                      {item.category}
                    </span>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center bg-[#FDFCFB] group-hover:bg-[#FFF] transition-colors relative overflow-hidden z-10">
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.12] transition-opacity duration-1000 pointer-events-none">
                       <LuxeArt seed={item.title} colorful={false} className="w-full h-full mix-blend-multiply" />
                    </div>
                    <h2 className="font-playfairDisplay text-[#1A1A1A] leading-tight group-hover:scale-105 transition-transform duration-700 ease-out text-3xl md:text-4xl relative z-10">
                      {item.title}
                    </h2>
                    <p className="font-outfit text-xs md:text-sm text-[#1A1A1A]/60 line-clamp-2 mt-4 max-w-xs mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="p-6 border-t border-[#1A1A1A]/5 flex justify-between items-center bg-[#FAFAF8] z-10">
                    <span className="font-outfit text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 group-hover:text-[#8D4004] transition-colors">
                      Read Entry
                    </span>
                    <ArrowRightIcon
                      size={20}
                      className="text-[#1A1A1A]/30 group-hover:text-[#8D4004] group-hover:translate-x-2 transition-all"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in">
            {filteredItems.map((item) => (
              <Link
                key={item.slug}
                to={
                  item.isSeries
                    ? `/blog/series/${item.slug}`
                    : `/blog/${item.slug}`
                }
                className="group relative block border border-[#1A1A1A]/5 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="hidden md:flex w-48 bg-[#FAFAF8] border-r border-[#1A1A1A]/5 items-center justify-center p-6 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                    <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
                      <LuxeArt seed={item.title} colorful={false} className="w-full h-full mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="font-playfairDisplay text-4xl text-[#1A1A1A] group-hover:italic transition-all">
                        {new Date(item.date).getDate().toString().padStart(2, '0')}
                      </div>
                      <div className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 mt-2">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-outfit text-[10px] uppercase tracking-widest text-[#8D4004] font-bold">
                        {item.category}
                      </span>
                      {item.isSeries && (
                        <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 border border-[#1A1A1A]/10 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                          <FolderIcon size={12} weight="fill" /> Series
                        </span>
                      )}
                      <div className="md:hidden font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">
                         {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <h2 className="font-playfairDisplay text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A] group-hover:translate-x-2 transition-transform duration-500 leading-tight mb-3">
                      {item.title}
                    </h2>

                    <p className="font-outfit text-sm text-[#1A1A1A]/60 line-clamp-2 max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center justify-center p-8 border-l border-[#1A1A1A]/5 bg-[#FAFAF8] group-hover:bg-[#1A1A1A] transition-colors duration-500 w-24 shrink-0">
                    <ArrowRightIcon size={24} className="text-[#1A1A1A]/20 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxeBlogPage;
