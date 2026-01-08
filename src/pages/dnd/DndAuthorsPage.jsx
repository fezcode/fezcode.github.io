import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import useSeo from '../../hooks/useSeo';
import piml from 'piml';
import { DndContext } from '../../context/DndContext';
import DndAuthorCard from '../../components/dnd/DndAuthorCard';
import DndLayout from '../../components/dnd/DndLayout';
import DndSearchInput from '../../components/dnd/DndSearchInput';
import { useAchievements } from '../../context/AchievementContext';
import { Users } from '@phosphor-icons/react';

function DndAuthorsPage() {
  const { setBreadcrumbs } = useContext(DndContext);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { unlockAchievement } = useAchievements();

  useSeo({
    title: 'Authors | From Serfs and Frauds',
    description: 'Meet the authors behind the Dungeons & Dragons stories, From Serfs and Frauds.',
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'authors'],
  });

  useEffect(() => {
    unlockAchievement('author_aficionado');
    setBreadcrumbs([{ label: 'S&F', path: '/stories' }, { label: 'Authors' }]);

    const fetchData = async () => {
      try {
        const [authRes, booksRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/stories/authors.piml`),
          fetch(`${process.env.PUBLIC_URL}/stories/books.piml`)
        ]);

        if (authRes.ok && booksRes.ok) {
          const [authText, booksText] = await Promise.all([authRes.text(), booksRes.text()]);
          setAuthors(piml.parse(authText).authors);
          setBooks(piml.parse(booksText).books);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [setBreadcrumbs, unlockAchievement]);

  const getBooksByAuthor = (authorName, authorAlias) => {
    const authorBooks = [];
    books.forEach((book) => {
      book.episodes.forEach((episode) => {
        if (
          (episode.author === authorName || episode.author === authorAlias) &&
          !authorBooks.some((b) => b.bookTitle === book.bookTitle)
        ) {
          authorBooks.push({
            bookId: book.bookId,
            bookTitle: book.bookTitle,
          });
        }
      });
    });
    return authorBooks;
  };

  const filteredAuthors = authors.filter(author => {
    const term = searchQuery.toLowerCase();
    return (
      author.name.toLowerCase().includes(term) ||
      author.alias.toLowerCase().includes(term)
    );
  });

  return (
    <DndLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-12 relative">
          <div className="flex justify-center mb-6">
             <Users size={48} className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />
          </div>
          <h1 className="text-4xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 leading-none">
            The Scribes
          </h1>
          <p className="text-lg md:text-xl font-arvo text-gray-400 max-w-2xl mx-auto uppercase tracking-widest opacity-60 mb-12">
            Meeting the voices behind the recorded history of the realms.
          </p>

          <DndSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search scribes by name or alias..."
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredAuthors.map((author, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <DndAuthorCard
                authorName={author.name}
                authorWebsite={author.website}
                authorImage={author.image}
                authorAlias={author.alias}
                booksWritten={getBooksByAuthor(author.name, author.alias)}
              />
            </motion.div>
          ))}
          {filteredAuthors.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/60 font-arvo italic">
              No scribes found matching your query.
            </div>
          )}
        </div>
      </div>
    </DndLayout>
  );
}

export default DndAuthorsPage;
