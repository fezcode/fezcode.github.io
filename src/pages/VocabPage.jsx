import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { vocabulary } from '../data/vocabulary';
import Seo from '../components/Seo';
import { useSidePanel } from '../context/SidePanelContext';

const BauhausShapes = ({ seed }) => {
  const shapes = useMemo(() => {
    // Simple deterministic RNG based on string seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const rng = () => {
      const x = Math.sin(hash++) * 10000;
      return x - Math.floor(x);
    };

    const count = 6;
    const items = [];
    const colors = ['#10b981', '#3b82f6', '#f87171', '#fb923c', '#ffffff'];

    for (let i = 0; i < count; i++) {
      items.push({
        type: Math.floor(rng() * 4), // 0: rect, 1: circle, 2: triangle, 3: arc
        x: rng() * 100,
        y: rng() * 100,
        size: 15 + rng() * 25,
        rotation: Math.floor(rng() * 4) * 90,
        color: colors[Math.floor(rng() * colors.length)],
        opacity: 0.03 + rng() * 0.07
      });
    }
    return items;
  }, [seed]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {shapes.map((s, i) => (
        <g key={i} transform={`translate(${s.x}, ${s.y}) rotate(${s.rotation})`}>
          {s.type === 0 && (
            <rect x={-s.size/2} y={-s.size/2} width={s.size} height={s.size} fill={s.color} fillOpacity={s.opacity} />
          )}
          {s.type === 1 && (
            <circle cx={0} cy={0} r={s.size/2} fill={s.color} fillOpacity={s.opacity} />
          )}
          {s.type === 2 && (
            <path d={`M 0 ${-s.size/2} L ${s.size/2} ${s.size/2} L ${-s.size/2} ${s.size/2} Z`} fill={s.color} fillOpacity={s.opacity} />
          )}
          {s.type === 3 && (
            <path d={`M ${-s.size/2} ${-s.size/2} A ${s.size} ${s.size} 0 0 1 ${s.size/2} ${s.size/2} L ${-s.size/2} ${s.size/2} Z`} fill={s.color} fillOpacity={s.opacity} />
          )}
        </g>
      ))}
    </svg>
  );
};

const VocabPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { openSidePanel } = useSidePanel();

  const vocabEntries = useMemo(() =>
    Object.entries(vocabulary).map(([slug, data]) => ({
      slug,
      ...data,
    })).sort((a, b) => a.title.localeCompare(b.title)),
  []);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return vocabEntries;
    return vocabEntries.filter((entry) =>
      entry.title.toLowerCase().includes(query) ||
      entry.slug.toLowerCase().includes(query)
    );
  }, [vocabEntries, searchQuery]);

  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach(entry => {
      const firstLetter = entry.title.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  const alphabet = useMemo(() => Object.keys(groupedEntries).sort(), [groupedEntries]);

  const handleOpenVocab = (entry) => {
    const LazyComponent = React.lazy(entry.loader);
    openSidePanel(entry.title, <LazyComponent />, 600);
  };

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f4] selection:bg-emerald-500/30 font-sans relative overflow-x-hidden">
      <Seo
        title="Glossary | Fezcodex"
        description="A dictionary of technical concepts and patterns."
        keywords={['Fezcodex', 'vocabulary', 'glossary', 'definitions']}
      />

      {/* Bauhaus Grid Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
           style={{
             backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 flex flex-col">
        {/* Header Section */}
        <header className="mb-24 flex flex-col items-start shrink-0">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-3 text-md font-instr-sans text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeftIcon size={16} />
            <span>Fezcodex Index</span>
          </Link>

          <h1 className="text-7xl md:text-9xl font-instr-serif italic tracking-tight mb-6 text-white leading-none">
            Glossary
          </h1>
          <p className="text-xl font-light text-gray-400 max-w-2xl font-instr-sans">
            A curated collection of technical concepts, design patterns, and terminology.
          </p>
        </header>

        {/* Sticky Search & Nav */}
        <div className="sticky top-6 z-30 mb-20 shrink-0">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-96">
                    <MagnifyingGlassIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search terms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-lg font-instr-sans placeholder-gray-600 focus:outline-none py-3 pl-12 pr-4 text-white"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500">
                            <XCircleIcon size={18} weight="fill" />
                        </button>
                    )}
                </div>

                <div className="h-8 w-px bg-white/10 hidden md:block" />

                <div className="flex flex-wrap gap-1 justify-center md:justify-start px-2 py-2 md:py-0 w-full overflow-x-auto no-scrollbar">
                    {alphabet.map(letter => (
                      <button
                        key={letter}
                        onClick={() => scrollToLetter(letter)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-gray-500 hover:bg-white hover:text-black transition-all font-mono"
                      >
                        {letter}
                      </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Content Container - Shrinks with content */}
        <div className="flex-1 space-y-24 mb-32">
          {alphabet.map((letter) => (
            <motion.section
              key={letter}
              id={`letter-${letter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="scroll-mt-40"
            >
              <div className="flex items-baseline gap-6 mb-10 border-b border-white/10 pb-4">
                <h2 className="text-6xl font-instr-serif italic text-white/20">{letter}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedEntries[letter].map((entry) => (
                  <button
                    key={entry.slug}
                    onClick={() => handleOpenVocab(entry)}
                    className="group flex flex-col text-left p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 rounded-xl relative overflow-hidden h-full"
                  >
                    {/* Procedural Bauhaus Background */}
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <BauhausShapes seed={entry.slug} />
                    </div>

                    {/* Decorative Bauhaus Shape Overlay */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex justify-between items-start w-full mb-6 relative z-10">
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                        {entry.slug}
                      </span>
                      <ArrowUpRightIcon
                        size={18}
                        className="text-gray-600 group-hover:text-white transition-colors"
                      />
                    </div>

                    <h3 className="text-2xl font-instr-serif text-white mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-white/30 relative z-10">
                      {entry.title}
                    </h3>
                  </button>
                ))}
              </div>
            </motion.section>
          ))}

          {filteredEntries.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-instr-serif italic text-2xl text-gray-600">No definitions found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabPage;
