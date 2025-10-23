import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePageTitle from '../utils/usePageTitle';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext'; // Import DndContext
import { parseWallpaperName } from '../utils/dndUtils'; // Import parseWallpaperName

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

function DndBookPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [pageTitle, setPageTitle] = useState('Loading Book...');
  const [bgImage, setBgImage] = useState(''); // State for background image
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/dnd/episodes.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const foundBook = data.find(b => b.bookId === parseInt(bookId));
        if (foundBook) {
          setBook(foundBook);
          setPageTitle(foundBook.bookTitle);
          setBreadcrumbs(
            [
              { label: 'D&D Home', path: '/dnd' },
              { label: 'The Lore', path: '/dnd/lore' },
              { label: foundBook.bookTitle, path: `/dnd/books/${foundBook.bookId}` },
            ]
          );
        } else {
          setPageTitle('Book Not Found');
          setBreadcrumbs(
            [
              { label: 'D&D Home', path: '/dnd' },
              { label: 'The Lore', path: '/dnd/lore' },
              { label: 'Book Not Found' },
            ]
          );
        }
      } catch (error) {
        console.error("Failed to fetch book data:", error);
        setPageTitle('Error Loading Book');
        setBreadcrumbs(
          [
            { label: 'D&D Home', path: '/dnd' },
            { label: 'The Lore', path: '/dnd/lore' },
            { label: 'Error Loading Book' },
          ]
        );
      }
    };

    fetchBookData();
  }, [bookId, setBreadcrumbs]);

  useEffect(() => {
    const images = [
      '/images/dnd/wallies/artem-sapegin-XGDBdSQ70O0-unsplash.jpg',
      '/images/dnd/wallies/ember-navarro-3q2TzsUUVIo-unsplash.jpg',
      '/images/dnd/wallies/jr-korpa-RADGP_E2pBk-unsplash.jpg',
      '/images/dnd/wallies/muhammad-haikal-sjukri--RMBf_xSf2U-unsplash.jpg',
      '/images/dnd/wallies/vida-huang-XHiLiBfp7UM-unsplash.jpg',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

  usePageTitle(pageTitle);

  if (!book) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="dnd-page-container"
      >
        <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})`, position: 'relative', minHeight: '100vh' }}>
          <h1 className="dnd-title-box">
            <span className="dnd-hero-title-white">{pageTitle}</span>
          </h1>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="dnd-page-container"
    >
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})`, position: 'relative', minHeight: '100vh' }}>
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">{book.bookTitle}</span>
        </h1>
        <div className="dnd-content-box" style={{ zIndex: 1 }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Episodes</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {book.episodes.map((episode) => (
              <li key={episode.id} style={{ marginBottom: '1rem' }}>
                <Link to={`/dnd/books/${book.bookId}/pages/${episode.id}`} style={{ color: '#E09500', textDecoration: 'none', fontSize: '1.5rem', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                  {episode.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default DndBookPage;
