import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, ArrowUpRightIcon, ArrowLeftIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';

const LuxeVocabPage = () => {
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
      entry.definition.toLowerCase().includes(query)
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
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo title="Fezcodex | Lexicon" description="Digital Glossary." />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">
           <Link to="/" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors">
               <ArrowLeftIcon /> FZCX Index
           </Link>
           <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
               Lexicon
           </h1>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
                   A compendium of terminology and defined concepts within the system. Curated for clarity and architectural precision.
               </p>

               <div className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors min-w-[300px]">
                   <input
                      type="text"
                      placeholder="Search Lexicon..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent py-2 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
                   />
                   <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
               </div>
           </div>
        </header>

        {/* Alphabet Navigation */}
        <div className="sticky top-24 z-20 mb-16 py-4 bg-[#F5F5F0]/80 backdrop-blur-md border-y border-[#1A1A1A]/5">
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                {alphabet.map(letter => (
                    <button
                        key={letter}
                        onClick={() => scrollToLetter(letter)}
                        className="w-8 h-8 flex items-center justify-center font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] hover:bg-white rounded-full transition-all"
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-32">
            {alphabet.map((letter) => (
                <section key={letter} id={`letter-${letter}`} className="scroll-mt-48">
                    <div className="flex items-baseline gap-8 mb-12 border-b border-[#1A1A1A]/5 pb-4">
                        <span className="font-playfairDisplay text-6xl md:text-8xl text-[#1A1A1A]/10 italic">{letter}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {groupedEntries[letter].map((entry) => (
                            <button
                                key={entry.slug}
                                onClick={() => handleOpenVocab(entry)}
                                className="group text-left space-y-4"
                            >
                                <div className="flex items-center justify-between border-b border-[#1A1A1A]/5 pb-2">
                                    <span className="font-outfit text-[10px] uppercase tracking-widest text-[#8D4004]">{entry.slug}</span>
                                    <ArrowUpRightIcon size={16} className="text-[#1A1A1A]/20 group-hover:text-[#8D4004] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </div>
                                <h3 className="font-playfairDisplay text-3xl text-[#1A1A1A] group-hover:italic transition-all leading-tight">
                                    {entry.title}
                                </h3>
                                <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed line-clamp-3 italic">
                                    {entry.definition}
                                </p>
                                {entry.tags && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {entry.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-outfit uppercase tracking-[0.2em] text-[#1A1A1A]/30">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>
            ))}
        </div>

        {filteredEntries.length === 0 && (
            <div className="py-32 text-center">
                <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40">No definitions found for "{searchQuery}"</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default LuxeVocabPage;
