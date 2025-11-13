import React, { useState, useEffect, useContext } from 'react';
import {Link, useParams} from 'react-router-dom';
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

function DndEpisodePage() {
  const { bookId, episodeId } = useParams(); // Get bookId as well
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context
  const [episodeContent, setEpisodeContent] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [book, setBook] = useState(null); // State to store the current book
  const [bgImage, setBgImage] = useState(''); // State for background image

  useSeo({
    title: `${episodeTitle} | From Serfs and Frauds`,
    description: `Read the episode "${episodeTitle}" from the Dungeons & Dragons campaign, From Serfs and Frauds.`,
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'episode', episodeTitle],
    ogTitle: `${episodeTitle} | From Serfs and Frauds`,
    ogDescription: `Read the episode "${episodeTitle}" from the Dungeons & Dragons campaign, From Serfs and Frauds.`,
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${episodeTitle} | From Serfs and Frauds`,
    twitterDescription: `Read the episode "${episodeTitle}" from the Dungeons & Dragons campaign, From Serfs and Frauds.`,
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  useEffect(() => {
    const images = dndWallpapers;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

  const [allBooks, setAllBooks] = useState([]); // Renamed from allEpisodes to allBooks

  useEffect(() => {
    const fetchAllBooks = async () => { // Renamed function
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/dnd/episodes.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllBooks(data);
      } catch (error) {
        console.error("Failed to fetch all books:", error);
      }
    };

    fetchAllBooks();
  }, []);

  useEffect(() => { // New useEffect to find the current book and episode
    if (allBooks.length > 0 && bookId && episodeId) {
      const foundBook = allBooks.find(b => b.bookId === parseInt(bookId));
      if (foundBook) {
        setBook(foundBook);
        const currentEpisodeIndex = foundBook.episodes.findIndex(ep => ep.id === parseInt(episodeId));
        if (currentEpisodeIndex !== -1) {
          const currentEpisode = foundBook.episodes[currentEpisodeIndex];
          setEpisodeTitle(currentEpisode.title);
          setBreadcrumbs([
            { label: 'S&F', path: '/dnd' },
            { label: 'The Lore', path: '/dnd/lore' },
            { label: foundBook.bookTitle, path: `/dnd/books/${foundBook.bookId}` },
            { label: currentEpisode.title },
          ]);
          // Fetch episode content
          const fetchEpisodeContent = async () => {
            try {
              const response = await fetch(`${process.env.PUBLIC_URL}/dnd/${currentEpisode.filename}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const text = await response.text();
              setEpisodeContent(text);
            } catch (error) {
              console.error("Failed to fetch episode content:", error);
              setEpisodeContent("Failed to load episode content. Please check the URL.");
            }
          };
          fetchEpisodeContent();
        } else {
          setEpisodeTitle("Episode Not Found");
          setEpisodeContent("Episode not found in this book.");
          setBreadcrumbs([
            { label: 'S&F', path: '/dnd' },
            { label: 'The Lore', path: '/dnd/lore' },
            { label: 'Episode Not Found' },
          ]);
        }
      } else {
        setEpisodeTitle("Book Not Found");
        setEpisodeContent("Book not found.");
        setBreadcrumbs([
          { label: 'S&F', path: '/dnd' },
          { label: 'The Lore', path: '/dnd/lore' },
          { label: 'Book Not Found' },
        ]);
      }
    }
  }, [allBooks, bookId, episodeId, setBreadcrumbs]); // Dependencies for this useEffect

  const currentEpisodeIndex = book ? book.episodes.findIndex(ep => ep.id === parseInt(episodeId)) : -1;
  const prevEpisode = (book && currentEpisodeIndex > 0) ? book.episodes[currentEpisodeIndex - 1] : null;
  const nextEpisode = (book && currentEpisodeIndex < book.episodes.length - 1) ? book.episodes[currentEpisodeIndex + 1] : null;

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
          <span className="dnd-hero-title-white">{episodeTitle}</span>
        </h1>
        <div className="dnd-content-box" style={{ zIndex: 1 }}>
          {episodeContent.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.6', textAlign: 'left' }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap justify-between w-[90%] max-w-[800px] mx-auto my-8 z-10 gap-4">
          <div className="flex-1 text-left min-w-[200px]">
            {prevEpisode && (
              <Link to={`/dnd/books/${bookId}/pages/${prevEpisode.id}`} className="dnd-episode-nav-button">
                &larr; Previous Episode
              </Link>)}
          </div>
          <div className="flex-1 text-center min-w-[200px]">
            <Link to="/dnd/lore" className="dnd-episode-nav-button">
              Show All Episodes
            </Link>
          </div>
          <div className="flex-1 text-right min-w-[200px]">
            {nextEpisode && (
              <Link to={`/dnd/books/${bookId}/pages/${nextEpisode.id}`} className="dnd-episode-nav-button">
                Next Episode &rarr;
              </Link>)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DndEpisodePage;
