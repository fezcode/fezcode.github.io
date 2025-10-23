import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePageTitle from '../utils/usePageTitle';
import '../styles/dnd.css';
// import dndEpisodes from '../utils/dndEpisodes'; // Removed import
import { Link } from 'react-router-dom'; // Import Link for navigation
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

function DndEpisodePage() {
  const { bookId, episodeId } = useParams(); // Get bookId as well
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context
  const [episodeContent, setEpisodeContent] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('Loading Episode...');
  const [book, setBook] = useState(null); // State to store the current book
  const [bgImage, setBgImage] = useState(''); // State for background image

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

  useEffect(() => {
    const fetchEpisodeContent = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/dnd/episode${episodeId}.txt`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setEpisodeContent(text);

        // Extract title from the first line of the content
        const firstLine = text.split('\n')[0];
        if (firstLine) {
          setEpisodeTitle(firstLine);
        } else {
          setEpisodeTitle(`Episode ${episodeId}`);
        }
      } catch (error) {
        console.error("Failed to fetch episode content:", error);
        setEpisodeContent("Failed to load episode content. Please check the URL.");
        setEpisodeTitle("Episode Not Found");
      }
    };

    fetchEpisodeContent();
  }, [episodeId]);

  usePageTitle(episodeTitle);

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
            { label: 'D&D Home', path: '/dnd' },
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
            { label: 'D&D Home', path: '/dnd' },
            { label: 'The Lore', path: '/dnd/lore' },
            { label: 'Episode Not Found' },
          ]);
        }
      } else {
        setEpisodeTitle("Book Not Found");
        setEpisodeContent("Book not found.");
        setBreadcrumbs([
          { label: 'D&D Home', path: '/dnd' },
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

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', maxWidth: '800px', margin: '2rem auto', zIndex: 1 }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            {prevEpisode && (
                          <Link to={`/dnd/books/${bookId}/pages/${prevEpisode.id}`} style={{ color: '#E09500', textDecoration: 'none', fontSize: '1.3rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)', border: '1px solid #E09500', padding: '0.5rem 1rem', borderRadius: '5px', backgroundColor: 'rgba(100, 60, 0, 0.5)' }}>
                            &larr; Previous Episode
                          </Link>            )}
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Link to="/dnd/lore" style={{ color: '#E09500', textDecoration: 'none', fontSize: '1.3rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)', border: '1px solid #E09500', padding: '0.5rem 1rem', borderRadius: '5px', backgroundColor: 'rgba(100, 60, 0, 0.5)' }}>
              Show All Episodes
            </Link>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            {nextEpisode && (
                          <Link to={`/dnd/books/${bookId}/pages/${nextEpisode.id}`} style={{ color: '#E09500', textDecoration: 'none', fontSize: '1.3rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)', border: '1px solid #E09500', padding: '0.5rem 1rem', borderRadius: '5px', backgroundColor: 'rgba(100, 60, 0, 0.5)' }}>
                            Next Episode &rarr;
                          </Link>            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DndEpisodePage;
