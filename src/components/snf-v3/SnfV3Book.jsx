import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toRoman } from '../../pages/snf-v3/snfV3Utils';

// Muted, aged cloth bindings — one per volume.
const BINDINGS = [
  '#7c2b2b', // oxblood
  '#2f4a44', // deep teal
  '#39466a', // navy
  '#6b5836', // ochre
  '#4a3550', // plum
  '#34442f', // forest
  '#5a3326', // chestnut
];

const SnfV3Book = ({ book, language = 'en' }) => {
  const color = BINDINGS[(Number(book.bookId) - 1) % BINDINGS.length];
  const firstEp = book.episodes?.[0];
  const to = firstEp ? `/bookshelf/read/${book.bookId}/${firstEp.id}` : '/bookshelf';
  const title = book.bookTitle.replace(/^Volume\s+[IVX]+:\s*/i, '');
  const count = book.episodes?.length || 0;
  const tr = language === 'tr';

  return (
    <div
      className="snf3-book-wrap relative"
      style={{ paddingBottom: 16, perspective: '1100px' }}
    >
      <div className="snf3-book-shadow" />
      <motion.div
        whileHover={{ rotateX: -8, rotateY: -7, y: -6, scale: 1.02, zIndex: 20 }}
        whileTap={{ rotateX: -4, rotateY: -3, scale: 1.0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 19 }}
        className="relative"
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center bottom' }}
      >
        <Link
          to={to}
          className="snf3-book"
          style={{ background: color }}
          aria-label={title}
        >
          <span className="snf3-book-pages" />
          <span className="snf3-book-num">VOL. {toRoman(book.bookId)}</span>
          <span className="block">
            <span className="snf3-book-title block">{title}</span>
            <span className="snf3-book-rule" />
            <span className="snf3-book-num block !text-[0.58rem] !tracking-[0.14em] opacity-85">
              {count} {tr ? 'bölüm' : count === 1 ? 'chapter' : 'chapters'}
            </span>
          </span>
        </Link>
      </motion.div>
    </div>
  );
};

export default SnfV3Book;
