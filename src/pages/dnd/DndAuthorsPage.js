import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import '../../styles/dnd.css';
import useSeo from "../../hooks/useSeo";
import piml from 'piml'; // Import piml
import { DndContext } from '../../context/DndContext'; // Import DndContext
import DndAuthorCard from '../../components/dnd/DndAuthorCard'; // Import DndAuthorCard
import { parseWallpaperName } from '../../utils/dndUtils'; // Import parseWallpaperName
import dndWallpapers from '../../utils/dndWallpapers'; // Import dndWallpapers

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

function DndAuthorsPage() {
  const { setBreadcrumbs, setBgImageName } = useContext(DndContext);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [bgImage, setBgImage] = useState(''); // State for background image

  useSeo({
    title: 'Authors | From Serfs and Frauds',
    description: 'Meet the authors behind the Dungeons & Dragons campaign, From Serfs and Frauds.',
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'authors'],
    ogTitle: 'Authors | From Serfs and Frauds',
    ogDescription: 'Meet the authors behind the Dungeons & Dragons campaign, From Serfs and Frauds.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Authors | From Serfs and Frauds',
    twitterDescription: 'Meet the authors behind the Dungeons & Dragons campaign, From Serfs and Frauds.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
      { label: 'Authors' },
    ]);

    const images = dndWallpapers;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));

    const fetchAuthorData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/stories/books.piml`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pimlText = await response.text();
        const data = piml.parse(pimlText);
        setAuthors(data.authors);
        setBooks(data.books);
      } catch (error) {
        console.error("Failed to fetch author data:", error);
      }
    };

    fetchAuthorData();
  }, [setBreadcrumbs, setBgImageName]);

  const getBooksByAuthor = (authorName, authorAlias) => {
    const authorBooks = [];
    books.forEach(book => {
      book.episodes.forEach(episode => {
        if ((episode.author === authorName || episode.author === authorAlias) && !authorBooks.some(b => b.bookTitle === book.bookTitle)) {
          authorBooks.push({
            bookId: book.bookId,
            bookTitle: book.bookTitle,
          });
        }
      });
    });
    return authorBooks;
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
      <div className="dnd-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${bgImage})` }}>
        <h1 className="dnd-title-box">
          <span className="dnd-hero-title-white">Authors</span>
        </h1>
        <div className="dnd-cards-container" style={{ zIndex: 1 }}>
          {authors.map((author, index) => (
            <DndAuthorCard
              key={index}
              authorName={author.name}
              authorWebsite={author.website}
              authorImage={author.image}
              authorAlias={author.alias} // Pass the alias
              booksWritten={getBooksByAuthor(author.name, author.alias)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default DndAuthorsPage;
