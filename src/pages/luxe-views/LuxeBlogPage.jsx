import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'feat', label: 'Feat' },
  { id: 'rant', label: 'Rant' },
  { id: 'series', label: 'Series' },
  { id: 'gist', label: 'Gist' },
  { id: 'd&d', label: 'D&D' },
];

const LuxeBlogPage = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
                date: post.date,
                updated: post.updated,
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
        combinedItems.sort((a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date));

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
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter || (activeFilter === 'series' && item.isSeries);
    const matchesSearch = !searchQuery ||
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
                   A curated collection of engineering notes, architectural decisions, and digital essays.
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
                   <div className="flex gap-2 overflow-x-auto no-scrollbar">
                       {FILTERS.map(f => (
                           <button
                              key={f.id}
                              onClick={() => setActiveFilter(f.id)}
                              className={`px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                  activeFilter === f.id
                                  ? 'bg-[#1A1A1A] text-white'
                                  : 'border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/60'
                              }`}
                           >
                               {f.label}
                           </button>
                       ))}
                   </div>
               </div>
           </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {loading ? (
                <div className="col-span-full py-32 text-center font-outfit text-[#1A1A1A]/40">Loading Archive...</div>
            ) : (
                filteredItems.map((item) => (
                    <Link key={item.slug} to={item.isSeries ? `/blog/series/${item.slug}` : `/blog/${item.slug}`} className="group block">
                        <div className="relative aspect-[4/5] bg-[#EBEBEB] overflow-hidden mb-6 border border-[#1A1A1A]/5">
                             {/* Art/Image */}
                             <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                                 <LuxeArt seed={item.title} className="w-full h-full opacity-80 mix-blend-multiply" />
                             </div>

                             {/* Date Badge */}
                             <div className="absolute top-4 left-4">
                                 <span className="bg-white/80 backdrop-blur-sm px-3 py-1 font-outfit text-[10px] uppercase tracking-widest border border-[#1A1A1A]/5">
                                     {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                 </span>
                             </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="font-outfit text-[10px] uppercase tracking-widest text-[#8D4004]">{item.category}</span>
                                {item.isSeries && <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 border border-[#1A1A1A]/10 px-1 rounded">Series</span>}
                            </div>

                            <h2 className="font-playfairDisplay text-3xl text-[#1A1A1A] group-hover:italic transition-all leading-tight">
                                {item.title}
                            </h2>

                            <p className="font-outfit text-sm text-[#1A1A1A]/60 line-clamp-2">
                                {item.description}
                            </p>

                            <div className="pt-4 flex items-center gap-2 text-[#1A1A1A] font-outfit text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                Read Entry <ArrowRightIcon />
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>

      </div>
    </div>
  );
};

export default LuxeBlogPage;
