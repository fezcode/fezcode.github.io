import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndCard from '../../components/dnd/DndCard';
import DndLayout from '../../components/dnd/DndLayout';
import DndSearchInput from '../../components/dnd/DndSearchInput';
import StoryTreeView from '../../components/dnd/StoryTreeView';
import Seo from '../../components/Seo';
import piml from 'piml';
import { BookOpenIcon, ScrollIcon } from '@phosphor-icons/react';

function DndLorePage() {
  const { setBreadcrumbs, language } = useContext(DndContext);
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
        const response = await fetch(
          `${process.env.PUBLIC_URL}/stories/books_${language || 'en'}.piml`,
        );
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
  }, [language]);

  const filteredBooks = books.filter((book) => {
    const term = searchQuery.toLowerCase();
    const titleMatch = book.bookTitle.toLowerCase().includes(term);
    const authorMatch = book.episodes?.some((ep) =>
      ep.author.toLowerCase().includes(term),
    );
    return titleMatch || authorMatch;
  });

  return (
    <DndLayout>
      <Seo
        title="The Lore | From Serfs and Frauds"
        description="Explore the world's history and tales from the Dungeons & Dragons campaign, From Serfs and Frauds."
        keywords={[
          'Fezcodex',
          'd&d',
          'dnd',
          'from serfs and frauds',
          'lore',
          'history',
          'tales',
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-16 relative">
          <div className="flex justify-center mb-6">
            <ScrollIcon
              size={48}
              className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]"
              weight="duotone"
            />
          </div>
          <h1 className="text-4xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 dnd-header-pulse">
            The Chronicles
          </h1>
          <p className="text-base md:text-xl font-arvo text-gray-400 max-w-2xl mx-auto uppercase tracking-widest opacity-60 mb-12 px-4">
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
                  icon={<BookOpenIcon size={48} weight="duotone" />}
                />{' '}
              </motion.div>
            ))}
            {filteredBooks.length === 0 && (
              <div className="col-span-full text-center py-12 text-white/60 font-arvo italic">
                No scrolls found matching your inquiry.
              </div>
            )}
          </div>

          {filteredBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-16 bg-dnd-gold/40" />
                <span className="font-mono text-xs text-dnd-gold uppercase tracking-[0.4em]">
                  Index of Tomes
                </span>
                <div className="h-px flex-grow bg-dnd-gold/40" />
              </div>
              <StoryTreeView books={filteredBooks} />
            </motion.div>
          )}
        </section>
      </div>
    </DndLayout>
  );
}
export default DndLorePage;
