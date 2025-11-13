import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext'; // Import DndContext
import { parseWallpaperName } from '../utils/dndUtils'; // Import parseWallpaperName
import dndWallpapers from '../utils/dndWallpapers';
import useSeo from "../hooks/useSeo";

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

  useSeo({
    title: `${pageTitle} | From Serfs and Frauds`,
    description: `Explore the episodes of ${pageTitle}, a book in the From Serfs and Frauds D&D campaign.`,
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'book', pageTitle],
    ogTitle: `${pageTitle} | From Serfs and Frauds`,
    ogDescription: `Explore the episodes of ${pageTitle}, a book in the From Serfs and Frauds D&D campaign.`,
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${pageTitle} | From Serfs and Frauds`,
    twitterDescription: `Explore the episodes of ${pageTitle}, a book in the From Serfs and Frauds D&D campaign.`,
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

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
              { label: 'S&F', path: '/dnd' },
              { label: 'The Lore', path: '/dnd/lore' },
              { label: foundBook.bookTitle, path: `/dnd/books/${foundBook.bookId}` },
            ]
          );
        } else {
          setPageTitle('Book Not Found');
          setBreadcrumbs(
            [
              { label: 'S&F', path: '/dnd' },
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
            { label: 'S&F', path: '/dnd' },
            { label: 'The Lore', path: '/dnd/lore' },
            { label: 'Error Loading Book' },
          ]
        );
      }
    };

    fetchBookData();
  }, [bookId, setBreadcrumbs]);

  useEffect(() => {
    const images = dndWallpapers;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

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
          <h2 >Episodes</h2>
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
