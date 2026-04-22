import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { vocabulary } from '../../data/vocabulary';
import Seo from '../../components/Seo';
import { useSidePanel } from '../../context/SidePanelContext';

const TerracottaVocabPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { openSidePanel } = useSidePanel();

  const vocabEntries = useMemo(
    () =>
      Object.entries(vocabulary)
        .map(([slug, data]) => ({ slug, ...data }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const filteredEntries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return vocabEntries;
    return vocabEntries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.slug.toLowerCase().includes(query),
    );
  }, [vocabEntries, searchQuery]);

  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach((entry) => {
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
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25 font-playfairDisplay relative overflow-x-hidden">
      <Seo title="Glossary | Fezcodex" description="A dictionary of technical concepts and patterns." />

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: 'linear-gradient(#1A1613 1px, transparent 1px), linear-gradient(90deg, #1A1613 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 flex flex-col">
        <header className="mb-24 flex flex-col items-start shrink-0">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-3 text-md text-[#2E2620]/60 hover:text-[#1A1613] transition-colors font-mono uppercase tracking-widest text-xs"
          >
            <ArrowLeftIcon size={16} />
            <span>Fezcodex Index</span>
          </Link>

          <h1 className="text-7xl md:text-9xl font-playfairDisplay italic tracking-tight mb-6 text-[#1A1613] leading-none">
            Glossary
          </h1>
          <p className="text-xl text-[#2E2620] max-w-2xl">
            A curated collection of technical concepts, design patterns, and terminology.
          </p>
        </header>

        <div className="sticky top-6 z-30 mb-20 shrink-0">
          <div className="bg-[#F3ECE0]/90 backdrop-blur-xl border border-[#1A161320] shadow-[0_20px_40px_-25px_#1A161330] rounded-sm p-2 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E2620]/50" />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-lg placeholder-[#2E2620]/40 focus:outline-none py-3 pl-12 pr-4 text-[#1A1613]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2E2620]/50 hover:text-[#9E4A2F]"
                >
                  <XCircleIcon size={18} weight="fill" />
                </button>
              )}
            </div>

            <div className="h-8 w-px bg-[#1A161320] hidden md:block" />

            <div className="flex flex-wrap gap-1 justify-center md:justify-start px-2 py-2 md:py-0 w-full overflow-x-auto no-scrollbar">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-[#2E2620]/50 hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-all font-mono"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-24 mb-32">
          {alphabet.map((letter) => (
            <motion.section
              key={letter}
              id={`letter-${letter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="scroll-mt-40"
            >
              <div className="flex items-baseline gap-6 mb-10 border-b border-[#1A161320] pb-4">
                <h2 className="text-6xl font-playfairDisplay italic text-[#1A161320]">{letter}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedEntries[letter].map((entry) => (
                  <button
                    key={entry.slug}
                    onClick={() => handleOpenVocab(entry)}
                    className="group flex flex-col text-left p-8 bg-[#F3ECE0] border border-[#1A161320] hover:border-[#1A1613] hover:shadow-[0_20px_40px_-25px_#1A161330] transition-all duration-300 rounded-sm relative overflow-hidden h-full"
                  >
                    <div className="flex justify-between items-start w-full mb-6 relative z-10">
                      <span className="font-mono text-[10px] text-[#2E2620]/60 uppercase tracking-widest group-hover:text-[#9E4A2F] transition-colors">
                        {entry.slug}
                      </span>
                      <ArrowUpRightIcon size={18} className="text-[#2E2620]/40 group-hover:text-[#1A1613] transition-colors" />
                    </div>

                    <h3 className="text-2xl font-playfairDisplay italic text-[#1A1613] mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-[#C96442] relative z-10">
                      {entry.title}
                    </h3>
                  </button>
                ))}
              </div>
            </motion.section>
          ))}

          {filteredEntries.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-playfairDisplay italic text-2xl text-[#2E2620]/40">
                No definitions found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerracottaVocabPage;
