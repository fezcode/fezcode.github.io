import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SquaresFourIcon,
  ListDashesIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  ArrowUpRightIcon,
  CubeIcon,
  LightningIcon,
  DropIcon
} from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import BrutalistModal from '../components/BrutalistModal';
import GenerativeArt from '../components/GenerativeArt';
import piml from 'piml';

// --- THEME CONFIGURATIONS ---
const THEMES = {
  neo: {
    id: 'neo',
    name: 'Neo-Brutalist',
    icon: <LightningIcon weight="fill" />,
    colors: {
      bg: 'bg-[#121212]',
      text: 'text-white',
      accent: 'text-[#ccff00]',
      accentBg: 'bg-[#ccff00]',
      border: 'border-white',
      borderWidth: 'border-2',
      cardBg: 'bg-[#1a1a1a]',
      navBg: 'bg-[#ccff00]',
      navText: 'text-black'
    },
    font: {
      head: 'font-mono',
      body: 'font-sans'
    },
    shape: 'rounded-none shadow-[4px_4px_0px_0px_#ffffff]'
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss Cyber',
    icon: <CubeIcon weight="fill" />,
    colors: {
      bg: 'bg-[#000000]',
      text: 'text-white',
      accent: 'text-[#ff3333]',
      accentBg: 'bg-[#ff3333]',
      border: 'border-white/20',
      borderWidth: 'border',
      cardBg: 'bg-black',
      navBg: 'bg-white',
      navText: 'text-black'
    },
    font: {
      head: 'font-sans tracking-tighter', // Inter/Helvetica style
      body: 'font-sans'
    },
    shape: 'rounded-none border-t border-b'
  },
  glass: {
    id: 'glass',
    name: 'Glass & Chrome',
    icon: <DropIcon weight="fill" />,
    colors: {
      bg: 'bg-[#050510]', // Gradient handled in render
      text: 'text-white',
      accent: 'text-cyan-400',
      accentBg: 'bg-cyan-500',
      border: 'border-white/10',
      borderWidth: 'border',
      cardBg: 'bg-white/5 backdrop-blur-xl',
      navBg: 'bg-black/20 backdrop-blur-md',
      navText: 'text-white'
    },
    font: {
      head: 'font-playfairDisplay',
      body: 'font-arvo'
    },
    shape: 'rounded-2xl'
  }
};

const TheVaguePage = () => {
  useSeo({
    title: 'The Vague | Fezcodex',
    description: 'Issues of The Vague. A collection of thoughts and whispers.',
    keywords: ['Fezcodex', 'The Vague', 'PDF', 'zine', 'editorial'],
  });

  // Data & State
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Controls
  const [theme, setTheme] = useState('neo'); // 'neo' | 'swiss' | 'glass'
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('desc');

  const currentTheme = THEMES[theme];

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('/the_vague/issues.piml');
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);
          const data = (parsed.issues || []);
          setIssues(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const getLink = (link) => {
    if (!link) return '#';
    if (link.startsWith('http') || link.startsWith('https')) return link;
    return `/the_vague/${link}`;
  };

  const sortedIssues = useMemo(() => {
      return [...issues].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [issues, sortOrder]);

  const latestIssue = useMemo(() => {
    if (issues.length === 0) return null;
    return [...issues].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [issues]);

  const handleIssueClick = (issue) => {
    setSelectedIssue({
        ...issue,
        url: getLink(issue.link),
        image: issue.thumbnail ? `/the_vague/${issue.thumbnail}` : null,
        actionLabel: 'Download Artifact'
    });
  };

  // --- RENDER HELPERS ---

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${currentTheme.colors.bg} ${currentTheme.colors.text}`}>
        <div className="flex flex-col items-center gap-4">
           <div className={`w-8 h-8 ${currentTheme.colors.accentBg} animate-spin`} />
           <span className={`${currentTheme.font.head} uppercase tracking-widest`}>Loading Artifacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.colors.bg} ${currentTheme.colors.text} ${currentTheme.font.body} transition-colors duration-500 flex flex-col relative`}>

       {/* Global Backgrounds for specific themes */}
       {theme === 'glass' && (
           <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[100px]" />
               <GenerativeArt seed="w1vqms" className="absolute inset-0 opacity-20 mix-blend-overlay" />
           </div>
       )}
       {theme === 'swiss' && (
           <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
       )}

       <BrutalistModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        item={selectedIssue}
       />

       {/* --- HEADER / CONTROLS --- */}
       <header className={`sticky top-0 z-50 w-full ${theme === 'neo' ? 'bg-[#ccff00] text-black border-b-2 border-black' : (theme === 'swiss' ? 'bg-black border-b border-white/20' : 'bg-black/10 backdrop-blur-md border-b border-white/10')} transition-all duration-300`}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">

              {/* Left: Home */}
              <Link
                to="/"
                className={`flex items-center gap-2 font-mono text-xs uppercase font-bold hover:opacity-70 ${theme === 'neo' ? 'text-black' : 'text-white'}`}
              >
                  <ArrowLeftIcon weight="bold" />
                  <span>Home</span>
              </Link>

              {/* Center: Title */}
              <div className={`${currentTheme.font.head} text-xl font-black tracking-tighter hidden md:block`}>
                  THE VAGUE
              </div>

              {/* Right: Theme Switcher */}
              <div className="flex items-center gap-2">
                  {Object.values(THEMES).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-2 transition-all ${t.id === theme ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-100'} ${theme === 'neo' ? 'text-black' : 'text-white'}`}
                        title={t.name}
                      >
                          {t.icon}
                      </button>
                  ))}
              </div>
          </div>
       </header>

       {/* --- MAIN CONTENT --- */}
       <main className="flex-grow container mx-auto px-4 py-12 relative z-10 flex flex-col gap-16">

          {/* HERO SECTION */}
          {latestIssue && (
              <section className="relative">
                  <div className={`flex flex-col md:flex-row gap-8 md:items-center ${theme === 'neo' ? 'border-2 border-white p-8 bg-[#1a1a1a]' : (theme === 'swiss' ? 'border-y border-white py-12' : 'p-0')}`}>

                      {/* Visual */}
                      <div className={`w-full md:w-1/3 aspect-[3/4] relative cursor-pointer group ${theme === 'neo' ? 'shadow-[8px_8px_0px_0px_#ccff00] border-2 border-white' : (theme === 'glass' ? 'rounded-2xl overflow-hidden shadow-2xl' : 'grayscale group-hover:grayscale-0 transition-all')}`} onClick={() => handleIssueClick(latestIssue)}>
                          {latestIssue.thumbnail ? (
                              <img src={`/the_vague/${latestIssue.thumbnail}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                              <GenerativeArt seed={latestIssue.title} className="w-full h-full" />
                          )}

                          {theme === 'neo' && (
                              <div className="absolute top-0 right-0 bg-[#ccff00] text-black font-mono font-bold text-xs px-2 py-1 border-l-2 border-b-2 border-white">
                                  LATEST
                              </div>
                          )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 flex flex-col items-start gap-6">
                          {theme === 'swiss' && <div className="w-full h-px bg-white/20 mb-4" />}

                          <div className={`inline-block px-3 py-1 ${theme === 'neo' ? 'bg-white text-black font-bold' : 'text-current border border-white/20'} text-[10px] uppercase font-mono tracking-widest`}>
                              Issue #{issues.length}
                          </div>

                          <h1 className={`${currentTheme.font.head} text-5xl md:text-7xl leading-[0.9] font-black uppercase break-words`}>
                              {latestIssue.title}
                          </h1>

                          <p className={`text-lg opacity-80 max-w-xl ${theme === 'swiss' ? 'font-mono text-xs' : ''}`}>
                              {latestIssue.description}
                          </p>

                          <button
                            onClick={() => handleIssueClick(latestIssue)}
                            className={`
                                group px-8 py-4 flex items-center gap-3 font-mono text-xs uppercase font-bold tracking-widest transition-all
                                ${theme === 'neo' ? 'bg-[#ccff00] text-black border-2 border-white shadow-[4px_4px_0px_0px_white] hover:translate-y-1 hover:translate-x-1 hover:shadow-none' : ''}
                                ${theme === 'swiss' ? 'bg-white text-black hover:bg-red-600 hover:text-white' : ''}
                                ${theme === 'glass' ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20' : ''}
                            `}
                          >
                              <span>Read Issue</span>
                              <ArrowRightIcon weight="bold" />
                          </button>
                      </div>
                  </div>
              </section>
          )}

          {/* CONTROLS BAR */}
          <div className={`flex flex-wrap items-center justify-between gap-4 p-4 ${theme === 'neo' ? 'bg-white text-black border-2 border-white' : (theme === 'glass' ? 'bg-white/5 border border-white/10 rounded-xl' : 'border-b border-white')}`}>
              <div className="flex items-center gap-2">
                 <span className="font-mono text-xs uppercase font-bold opacity-60">Archive View:</span>
                 <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}><SquaresFourIcon size={20} weight="fill" /></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}><ListDashesIcon size={20} weight="bold" /></button>
              </div>

              <div className="flex items-center gap-2">
                 <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-2 font-mono text-xs uppercase font-bold hover:opacity-70">
                     <span>Date</span>
                     {sortOrder === 'asc' ? <SortAscendingIcon size={16} /> : <SortDescendingIcon size={16} />}
                 </button>
              </div>
          </div>

                    {/* ARCHIVE GRID/LIST */}
                              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'flex flex-col gap-4'}`}>
                                  {sortedIssues.map((issue) => (
                                      <motion.div
                                        key={issue.id}
                                        layout
                                        transition={{
                                          layout: { type: "spring", stiffness: 600, damping: 40 },
                                          opacity: { duration: 0.1 }
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}                              onClick={() => handleIssueClick(issue)}
                              className={`
                                  group cursor-pointer relative flex flex-col
                                  ${viewMode === 'list' ? 'md:flex-row md:items-center gap-6' : ''}
                                  ${theme === 'neo' ? 'bg-[#1a1a1a] border-2 border-white p-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_#ccff00] hover:border-[#ccff00] transition-all' : ''}
                                  ${theme === 'swiss' ? 'bg-transparent border-t border-white/20 py-4 hover:bg-white/5' : ''}
                                  ${theme === 'glass' ? 'bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all' : ''}
                              `}
                            >
                                {/* Thumbnail */}
                                <div className={`
                                    relative overflow-hidden
                                    ${viewMode === 'grid' ? 'aspect-[3/4] w-full' : 'w-full md:w-24 aspect-square'}
                                    ${theme === 'neo' ? 'border-2 border-white mb-3' : ''}
                                    ${theme === 'glass' && viewMode === 'list' ? 'rounded-lg' : ''}
                                `}>
                                     {issue.thumbnail ? (
                                         <img src={`/the_vague/${issue.thumbnail}`} alt="" className={`w-full h-full object-cover transition-transform duration-500 ${theme === 'swiss' ? 'grayscale group-hover:grayscale-0' : 'group-hover:scale-110'}`} />
                                     ) : (
                                         <GenerativeArt seed={issue.title} className="w-full h-full" />
                                     )}

                                     {theme === 'neo' && (
                                         <div className="absolute inset-0 bg-[#ccff00] mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                                     )}
                                </div>

                                {/* Info */}
                                <div className={`${viewMode === 'grid' && theme === 'glass' ? 'p-4' : 'flex-1'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-mono text-[9px] uppercase tracking-widest ${theme === 'neo' ? 'text-[#ccff00]' : 'text-gray-400'}`}>
                                            {issue.date}
                                        </span>
                                        {theme === 'swiss' && <span className="font-mono text-[9px] text-red-500">ID: {issue.id}</span>}
                                    </div>

                                    <h3 className={`${currentTheme.font.head} ${viewMode === 'grid' ? 'text-lg' : 'text-xl'} font-bold mb-1 group-hover:underline decoration-2 underline-offset-4`}>
                                        {issue.title}
                                    </h3>

                                    {viewMode === 'list' && (
                                        <p className="text-xs opacity-60 line-clamp-1 max-w-xl">{issue.description}</p>
                                    )}

                                    {viewMode === 'grid' && theme !== 'swiss' && (
                                       <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                           <ArrowUpRightIcon size={20} weight="bold" className={currentTheme.colors.accent} />
                                       </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
       </main>

       {/* --- FOOTER --- */}
       <footer className={`py-12 border-t ${theme === 'neo' ? 'bg-[#ccff00] text-black border-white' : (theme === 'swiss' ? 'bg-black border-white/20' : 'bg-black/40 border-white/10')} relative z-10`}>
           <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className={`${currentTheme.font.head} text-4xl font-black tracking-tighter`}>
                   FEZCODEX
               </div>

               <div className="flex gap-8 font-mono text-xs uppercase font-bold opacity-60">
                   <span>Archive</span>
                   <span>Editorial</span>
                   <span>Signal</span>
               </div>

               <div className="font-mono text-[10px] opacity-50">
                   &copy; {new Date().getFullYear()}
               </div>
           </div>
       </footer>

    </div>
  );
};

export default TheVaguePage;
