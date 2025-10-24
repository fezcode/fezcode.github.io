import React, { useState, useEffect, useContext } from 'react'; // Added useState, useEffect, and useContext
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePageTitle from '../utils/usePageTitle';
import '../styles/dnd.css';
import { DndContext } from '../context/DndContext'; // Import DndContext
import { parseWallpaperName } from '../utils/dndUtils'; // Import parseWallpaperName
import dndWallpapers from '../utils/dndWallpapers';
import DndCard from '../components/DndCard'; // Import DndCard
import Slider from 'react-slick'; // Import Slider
import 'slick-carousel/slick/slick.css'; // Import slick-carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick-carousel theme CSS

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
  const [bgImage, setBgImage] = useState(''); // State for background image

  useEffect(() => {
    const randomImage = dndWallpapers[Math.floor(Math.random() * dndWallpapers.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
    setBreadcrumbs([
      { label: 'S&F', path: '/dnd' },
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
            {episodes.map((book) => (
              <div key={book.bookId} className="px-12"> {/* Add padding for spacing between cards */}
                <DndCard
                  title={book.bookTitle}
                  author={book.episodes && book.episodes.length > 0 ? `${book.episodes[0].author}` : "No author information"}
                  link={`/dnd/books/${book.bookId}`}
                  backgroundImage={`${process.env.PUBLIC_URL}/images/dnd/book-cover.png`}
                  overlayColor={book.overlay}
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="dnd-content-box" style={{ zIndex: 1, marginTop: '2rem' }}>
          <h2 >All Books</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {episodes.map((book) => (
                <li key={book.bookId} style={{ marginBottom: '1rem' }}>
                  <Link to={`/dnd/books/${book.bookId}`} className="dnd-list-item-link">
                    {book.bookTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
      </div>
    </motion.div>
  );
}

export default DndLorePage;
