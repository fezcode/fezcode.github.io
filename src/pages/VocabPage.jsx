import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BookBookmarkIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  ArrowSquareOutIcon,
  FileTextIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabulary } from '../data/vocabulary';
import useSeo from '../hooks/useSeo';
import { useSidePanel } from '../context/SidePanelContext';
import BreadcrumbTitle from '../components/BreadcrumbTitle';
import GenerativeArt from '../components/GenerativeArt';

const VocabPage = () => {
  useSeo({
    title: 'Glossary | Fezcodex',
    description:
      'A collection of technical terms, concepts, and definitions used across Fezcodex.',
    keywords: ['Fezcodex', 'vocabulary', 'glossary', 'definitions'],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const { openSidePanel } = useSidePanel();

  const vocabEntries = useMemo(() =>
    Object.entries(vocabulary).map(([slug, data]) => ({
      slug,
      ...data,
    })).sort((a, b) => a.title.localeCompare(b.title)),
  []);

  const filteredEntries = vocabEntries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach(entry => {
      const firstLetter = entry.title.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  const alphabet = Object.keys(groupedEntries).sort();

  const handleOpenVocab = (entry) => {
    const LazyComponent = React.lazy(entry.loader);
    openSidePanel(entry.title, <LazyComponent />, 600);
  };

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const offset = 120; // sticky header offset
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Back to Home</span>
          </Link>

          <BreadcrumbTitle
            title="Glossary"
            breadcrumbs={['fc', 'reference', 'terms']}
            variant="brutalist"
          />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] max-w-sm">
              {'//'} A dictionary of technical concepts, patterns, and terminology used throughout this digital garden.
            </p>
            <div className="flex gap-4">
              <span className="px-2 py-1 bg-white/5 border border-white/10 text-gray-500 font-mono text-[9px] uppercase tracking-widest">
                Entries: {vocabEntries.length}
              </span>
            </div>
          </div>
        </header>

                {/* Dictionary Navigation & Search Sticky Bar */}

                <div className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-md pb-6 pt-2 mb-16">

                  {/* Alphabet Nav */}

                  <div className="flex flex-wrap gap-2 mb-8 mt-2">

                    {alphabet.map(letter => (

                      <button

                        key={letter}

                        onClick={() => scrollToLetter(letter)}

                        className="w-8 h-8 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-emerald-500 hover:text-black transition-all font-black text-xs uppercase"

                      >

                        {letter}

                      </button>

                    ))}

                  </div>

                  <div className="relative group">

                    <MagnifyingGlassIcon

                      size={20}

                      className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-emerald-500 transition-colors"

                    />

                    <input

                      type="text"

                      placeholder="Search terms..."

                      value={searchQuery}

                      onChange={(e) => setSearchQuery(e.target.value)}

                      className="w-full bg-transparent border-b border-gray-800 text-xl md:text-2xl font-light text-white placeholder-gray-700 focus:border-emerald-500 focus:outline-none py-2 pl-8 transition-colors font-mono"

                    />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors"
              >
                <XCircleIcon size={20} weight="fill" />
              </button>
            )}
          </div>
        </div>

        {/* Dictionary Groups */}
        <div className="pb-48 space-y-24">
          <AnimatePresence mode="popLayout">
            {alphabet.map((letter) => (
              <motion.section
                key={letter}
                id={`letter-${letter}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <h2 className="text-7xl font-black text-white leading-none opacity-20">{letter}</h2>
                  <div className="h-px flex-grow bg-white/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedEntries[letter].map((entry) => (
                    <div key={entry.slug} className="flex flex-col h-full space-y-4">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                        <FileTextIcon size={14} /> {entry.slug.toUpperCase()}
                      </span>
                      <motion.button
                        layout
                        onClick={() => handleOpenVocab(entry)}
                        className="group relative flex flex-col items-start text-left p-8 rounded-none bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-all hover:bg-emerald-500/[0.02] flex-grow overflow-hidden"
                      >
                        {/* Background Generative Art - High Visibility */}
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-80 transition-opacity pointer-events-none scale-125 grayscale group-hover:grayscale-0 group-hover:scale-100 duration-1000">
                          <GenerativeArt seed={entry.slug} className="w-full h-full" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        </div>

                        {/* Ribbon */}
                        <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 pointer-events-none z-10">
                          <div className="absolute top-[12px] right-[-24px] w-[80px] bg-emerald-500 text-black text-[8px] font-black font-mono text-center rotate-45 uppercase py-0.5 shadow-lg">
                            TERM
                          </div>
                        </div>

                        <div className="mb-6 text-emerald-500 group-hover:text-emerald-400 transition-colors relative z-10">
                          <BookBookmarkIcon size={32} weight="duotone" />
                        </div>

                        <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 group-hover:text-emerald-400 transition-colors leading-none relative z-10">
                          {entry.title}
                        </h3>

                        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-auto group-hover:text-gray-400 transition-colors border-t border-white/5 pt-4 w-full relative z-10">
                          {'//'} {entry.slug}
                        </span>

                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 z-10">
                          <ArrowSquareOutIcon size={16} className="text-emerald-500" />
                        </div>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <div className="py-20 text-center font-mono text-gray-600 uppercase tracking-widest border border-dashed border-white/5 bg-white/[0.01]">
              No matching terms found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabPage;