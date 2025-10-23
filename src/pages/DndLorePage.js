import React, { useState, useEffect, useContext } from 'react'; // Added useState, useEffect, and useContext
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePageTitle from '../utils/usePageTitle';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext'; // Import DndContext
import { parseWallpaperName } from '../utils/dndUtils'; // Import parseWallpaperName
import DndCard from '../components/DndCard'; // Import DndCard

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

function DndLorePage() {
  usePageTitle('The Lore');
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context

  useEffect(() => {
    setBgImageName(parseWallpaperName('artem-sapegin-XGDBdSQ70O0-unsplash.jpg')); // Set parsed name for the static background
    setBreadcrumbs([
      { label: 'D&D Home', path: '/dnd' },
      { label: 'The Lore', path: '/dnd/lore' },
    ]);
  }, [setBgImageName, setBreadcrumbs]);

  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/dnd/episodes.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEpisodes(data);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="dnd-page-container"
    >
      <div className="dnd-hero" style={{ position: 'relative', minHeight: '100vh' }}>
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">The Lore</span>
        </h1>
        <div className="dnd-content-box" style={{ zIndex: 1 }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Books</h2>
          <div className="dnd-cards-container" style={{ justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {episodes.map((book) => (
              <DndCard
                key={book.bookId}
                title={book.bookTitle}
                author={book.episodes && book.episodes.length > 0 ? `${book.episodes[0].author}` : "No author information"}
                link={`/dnd/books/${book.bookId}`}
                backgroundImage={`${process.env.PUBLIC_URL}/images/dnd/book-cover.png`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DndLorePage;
