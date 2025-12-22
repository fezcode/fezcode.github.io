import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndLayout from '../../components/dnd/DndLayout';
import useSeo from '../../hooks/useSeo';
import piml from 'piml';
import { Scroll, BookmarkSimple } from '@phosphor-icons/react';

function DndBookPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [pageTitle, setPageTitle] = useState('Loading Book...');
  const { setBreadcrumbs } = useContext(DndContext);

  useSeo({
    title: `${pageTitle} | From Serfs and Frauds`,
    description: `Explore the episodes of ${pageTitle}, a book in the From Serfs and Frauds D&D campaign.`,
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'book', pageTitle],
  });

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`/stories/books.piml`);
        if (response.ok) {
          const pimlText = await response.text();
          const data = piml.parse(pimlText);
          const foundBook = data.books.find((b) => b.bookId === parseInt(bookId));
          if (foundBook) {
            setBook(foundBook);
            setPageTitle(foundBook.bookTitle);
            setBreadcrumbs([
              { label: 'S&F', path: '/stories' },
              { label: 'The Lore', path: '/stories/lore' },
              {
                label: foundBook.bookTitle,
                path: `/stories/books/${foundBook.bookId}`,
              },
            ]);
          } else {
            setPageTitle('Book Not Found');
          }
        }
      } catch (error) {
        console.error('Failed to fetch book data:', error);
        setPageTitle('Error Loading Book');
      }
    };
    fetchBookData();
  }, [bookId, setBreadcrumbs]);

  return (
    <DndLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-24">
          <div className="flex justify-center mb-6">
             <BookmarkSimple size={48} className="text-dnd-gold" weight="duotone" />
          </div>
          <h1 className="text-5xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 leading-none dnd-header-pulse">
            {pageTitle}
          </h1>
          <div className="h-px w-32 bg-dnd-gold mx-auto opacity-40" />
        </header>

        {book && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="dnd-parchment-container p-12 md:p-24 shadow-2xl border-2 border-black/10 dnd-parchment-glow relative"
          >
            {/* Scroll Ornaments */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-dnd-crimson/5 rounded-b-full blur-xl dnd-scroll-accent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-dnd-crimson/5 rounded-t-full blur-xl dnd-scroll-accent" />

            <div className="dnd-ornate-corner dnd-ornate-corner-tl !w-16 !h-16" />
            <div className="dnd-ornate-corner dnd-ornate-corner-tr !w-16 !h-16" />
            <div className="dnd-ornate-corner dnd-ornate-corner-bl !w-16 !h-16" />
            <div className="dnd-ornate-corner dnd-ornate-corner-br !w-16 !h-16" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-dnd-crimson/10">
                <Scroll size={32} className="text-dnd-crimson" weight="duotone" />
                <h2 className="text-3xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter">
                  Recorded Episodes
                </h2>
              </div>

              <div className="dnd-mystic-divider mb-12 opacity-20" />

              <div className="grid gap-4">
                {book.episodes.map((episode, idx) => (
                  <Link
                    key={episode.id}
                    to={`/stories/books/${book.bookId}/pages/${episode.id}`}
                    className="group flex items-center justify-between p-6 bg-white/5 border border-transparent hover:border-dnd-crimson/20 hover:bg-dnd-crimson/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-xs text-dnd-crimson/40 group-hover:text-dnd-crimson/100 transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-2xl font-arvo font-bold text-dnd-crimson/80 group-hover:text-dnd-crimson transition-colors">
                        {episode.title}
                      </span>
                    </div>
                    <div className="h-px flex-grow mx-8 bg-dnd-crimson/5 group-hover:bg-dnd-crimson/20 transition-colors" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dnd-crimson/40 group-hover:text-dnd-crimson transition-colors">
                      View Script
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DndLayout>
  );
}

export default DndBookPage;
