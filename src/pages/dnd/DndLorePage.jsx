import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndCard from '../../components/dnd/DndCard';
import DndLayout from '../../components/dnd/DndLayout';
import DndSearchInput from '../../components/dnd/DndSearchInput';
import useSeo from '../../hooks/useSeo';
import piml from 'piml';
import { BookOpen, Scroll } from '@phosphor-icons/react';

function DndLorePage() {
  useSeo({
    title: 'The Lore | From Serfs and Frauds',
    description: "Explore the world's history and tales from the Dungeons & Dragons campaign, From Serfs and Frauds.",
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'lore', 'history', 'tales'],
  });

  const { setBreadcrumbs } = useContext(DndContext);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
      { label: 'The Lore', path: '/stories/lore' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/stories/books.piml`);
        if (response.ok) {
          const pimlText = await response.text();
          const data = piml.parse(pimlText);
          const sortedBooks = data.books.sort((a, b) => a.bookId - b.bookId);
          setBooks(sortedBooks);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter(book => {
    const term = searchQuery.toLowerCase();
    const titleMatch = book.bookTitle.toLowerCase().includes(term);
    const authorMatch = book.episodes?.some(ep => ep.author.toLowerCase().includes(term));
    return titleMatch || authorMatch;
  });

  return (
    <DndLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-12 relative">
          <div className="flex justify-center mb-6">
             <Scroll size={48} className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />
          </div>
          <h1 className="text-5xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 dnd-header-pulse">
            The Chronicles
          </h1>
          <p className="text-lg md:text-xl font-arvo text-gray-400 max-w-2xl mx-auto uppercase tracking-widest opacity-60 mb-12">
            A compendium of documented history and ancient scripts.
          </p>

          <DndSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search chronicles by title or scribe..."
          />
        </header>

        <section className="space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {filteredBooks.map((book, idx) => (
              <motion.div
                key={book.bookId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <DndCard
                  title={book.bookTitle}
                  description={
                    book.episodes && book.episodes.length > 0
                      ? `Authored by ${book.episodes[0].author}`
                      : 'Ancient scripts of unknown origin.'
                  }
                  link={`/stories/books/${book.bookId}`}
                  icon={<BookOpen size={48} weight="duotone" />}
                />
              </motion.div>
            ))}
            {filteredBooks.length === 0 && (
              <div className="col-span-full text-center py-12 text-white/60 font-arvo italic">
                No scrolls found matching your inquiry.
              </div>
            )}
          </div>

          <div className="dnd-parchment-container p-12 md:p-24 shadow-2xl border-2 border-black/10 dnd-parchment-glow relative">
            {/* Scroll Ornaments */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-dnd-crimson/5 rounded-b-full blur-xl dnd-scroll-accent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-dnd-crimson/5 rounded-t-full blur-xl dnd-scroll-accent" />

            <div className="dnd-ornate-corner dnd-ornate-corner-tl !w-16 !h-16" />
            <div className="dnd-ornate-corner dnd-ornate-corner-tr !w-16 !h-16" />
            <div className="dnd-ornate-corner dnd-ornate-corner-bl !w-16 !h-16" />
            <div className="dnd-ornate-corner dnd-ornate-corner-br !w-16 !h-16" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-12">
                Index of Tomes
              </h2>
              <div className="dnd-mystic-divider mb-12" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                {books.map((book) => (
                  <Link
                    key={book.bookId}
                    to={`/stories/books/${book.bookId}`}
                    className="group flex items-center gap-4 p-4 border-b border-dnd-crimson/10 hover:bg-dnd-crimson/5 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-dnd-crimson group-hover:scale-150 transition-transform" />
                    <span className="text-xl font-arvo font-bold text-dnd-crimson/80 group-hover:text-dnd-crimson transition-colors">
                      {book.bookTitle}
                    </span>
                  </Link>
                ))}
              </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </DndLayout>
              );
            }
export default DndLorePage;
