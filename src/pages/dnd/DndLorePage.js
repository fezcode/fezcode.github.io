import React, { useState, useEffect, useContext } from 'react'; // Added useState, useEffect, and useContext
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/dnd.css';
import { DndContext } from '../../context/DndContext'; // Import DndContext
import { parseWallpaperName } from '../../utils/dndUtils'; // Import parseWallpaperName
import dndWallpapers from '../../utils/dndWallpapers';
import DndCard from '../../components/dnd/DndCard'; // Import DndCard
import Slider from 'react-slick'; // Import Slider
import 'slick-carousel/slick/slick.css'; // Import slick-carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick-carousel theme CSS
import useSeo from "../../hooks/useSeo";
import piml from 'piml';

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
  useSeo({
    title: 'The Lore | From Serfs and Frauds',
    description: 'Explore the world\'s history and tales from the Dungeons & Dragons campaign, From Serfs and Frauds.',
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'lore', 'history', 'tales'],
    ogTitle: 'The Lore | From Serfs and Frauds',
    ogDescription: 'Explore the world\'s history and tales from the Dungeons & Dragons campaign, From Serfs and Frauds.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'The Lore | From Serfs and Frauds',
    twitterDescription: 'Explore the world\'s history and tales from the Dungeons & Dragons campaign, From Serfs and Frauds.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const { setBgImageName, setBreadcrumbs } = useContext(DndContext); // Get setBgImageName and setBreadcrumbs from context
  const [bgImage, setBgImage] = useState(''); // State for background image

  useEffect(() => {
    const randomImage = dndWallpapers[Math.floor(Math.random() * dndWallpapers.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
      { label: 'The Lore', path: '/stories/lore' },
    ]);
  }, [setBgImageName, setBreadcrumbs]);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/stories/books.piml`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pimlText = await response.text();
        const data = piml.parse(pimlText);
        // Sort books by bookId before setting the state
        const sortedBooks = data.books.sort((a, b) => a.bookId - b.bookId);
        setBooks(sortedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="dnd-page-container"
    >
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})`, position: 'relative' }}>
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">The Lore</span>
        </h1>
        <div className="dnd-content-box dnd-books-section" style={{ zIndex: 1 }}>
          <h2 >Books</h2>
          <Slider {...settings} className="dnd-carousel">
            {books.map((book) => (
              <div key={book.bookId} className="px-12"> {/* Add padding for spacing between cards */}
                <DndCard
                  title={book.bookTitle}
                  author={book.episodes && book.episodes.length > 0 ? `${book.episodes[0].author}` : "No author information"}
                  link={`/stories/books/${book.bookId}`}
                  backgroundImage={`${process.env.PUBLIC_URL}/images/stories/book-cover.png`}
                  overlayColor={book.overlay}
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="dnd-content-box" style={{ zIndex: 1, marginTop: '2rem' }}>
          <h2 >All Books</h2>
          {books.map((book) => (
            <div key={book.bookId} className="px-12 mb-4 mt-4">
              <Link to={`/stories/books/${book.bookId}`} className="border-1 p-2 transition transition-all text-2xl text-rose-600 hover:underline hover:text-amber-600">
                {book.bookTitle}
              </Link>
            </div>
          ))}
          </div>
      </div>
    </motion.div>
  );
}

export default DndLorePage;
