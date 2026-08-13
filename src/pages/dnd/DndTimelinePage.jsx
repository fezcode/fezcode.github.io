import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DndContext } from '../../context/DndContext';
import DndLayout from '../../components/dnd/DndLayout';
import DndSearchInput from '../../components/dnd/DndSearchInput';
import Seo from '../../components/Seo';
import piml from 'piml';
import { HourglassIcon, BookOpenIcon } from '@phosphor-icons/react';

function DndTimelinePage() {
  const { setBreadcrumbs } = useContext(DndContext);
  const [eras, setEras] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
      { label: 'The Lore', path: '/stories/lore' },
      { label: 'The Chronology', path: '/stories/timeline' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${''}/stories/timeline.piml`);
        if (response.ok) {
          const data = piml.parse(await response.text());
          setEras(data.timeline || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const term = searchQuery.toLowerCase();
  const filteredEras = eras
    .map((era) => ({
      ...era,
      events: (era.events || []).filter(
        (ev) =>
          (ev.title || '').toLowerCase().includes(term) ||
          (ev.description || '').toLowerCase().includes(term) ||
          (ev.year || '').toLowerCase().includes(term) ||
          (era.eraTitle || '').toLowerCase().includes(term),
      ),
    }))
    .filter((era) => era.events.length > 0);

  return (
    <DndLayout>
      <Seo
        title="The Chronology | From Serfs and Frauds"
        description="A timeline of the world of Thornus, from the end of the Great War to the Fall of St. Jude's, era by era."
        keywords={[
          'Fezcodex',
          'd&d',
          'dnd',
          'from serfs and frauds',
          'timeline',
          'chronology',
          'history',
        ]}
      />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center mb-16 relative">
          <div className="flex justify-center mb-6">
            <HourglassIcon
              size={48}
              className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]"
              weight="duotone"
            />
          </div>
          <h1 className="text-4xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 dnd-header-pulse">
            The Chronology
          </h1>
          <p className="text-base md:text-xl font-arvo text-gray-400 max-w-2xl mx-auto uppercase tracking-widest opacity-60 mb-12 px-4">
            The measured years of Thornus, counted After the War.
          </p>

          <DndSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search the years by event, era, or date..."
          />
        </header>

        <section className="space-y-24">
          {filteredEras.map((era) => (
            <div key={era.eraId}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-16 bg-dnd-gold/40" />
                  <span className="font-mono text-xs text-dnd-gold uppercase tracking-[0.4em] whitespace-nowrap">
                    {era.eraSpan}
                  </span>
                  <div className="h-px flex-grow bg-dnd-gold/40" />
                </div>
                <h2 className="text-3xl md:text-5xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-3">
                  {era.eraTitle}
                </h2>
                <p className="text-sm md:text-base font-arvo text-gray-400 italic opacity-80 max-w-3xl">
                  {era.eraDescription}
                </p>
              </motion.div>

              <ol className="relative border-l-2 border-dnd-gold/30 ml-2 md:ml-6 space-y-14">
                {era.events.map((ev, idx) => (
                  <motion.li
                    key={`${era.eraId}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                    className="relative pl-8 md:pl-12"
                  >
                    <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dnd-crimson border-2 border-dnd-gold shadow-[0_0_10px_rgba(249,224,118,0.5)]" />

                    <div className="font-mono text-xs text-dnd-gold uppercase tracking-[0.3em] mb-2">
                      {ev.year}
                    </div>
                    <h3 className="text-xl md:text-2xl font-playfairDisplay italic font-bold text-white/90 tracking-tight mb-2">
                      {ev.title}
                    </h3>
                    <p className="text-sm md:text-base font-arvo text-gray-300 leading-relaxed max-w-3xl">
                      {ev.description}
                    </p>
                    {ev.book && ev.bookId && (
                      <Link
                        to={`/stories/books/${ev.bookId}`}
                        className="inline-flex items-center gap-2 mt-3 text-[10px] font-mono text-dnd-gold-light/70 uppercase tracking-widest hover:text-dnd-gold transition-colors"
                      >
                        <BookOpenIcon size={14} weight="duotone" />
                        {ev.book}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ol>
            </div>
          ))}
          {filteredEras.length === 0 && (
            <div className="text-center py-12 text-white/60 font-arvo italic">
              No hours found matching your inquiry.
            </div>
          )}
        </section>
      </div>
    </DndLayout>
  );
}

export default DndTimelinePage;
