import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HouseIcon } from '@phosphor-icons/react';
import SnfV3Root from '../../components/snf-v3/SnfV3Root';
import SnfV3Book from '../../components/snf-v3/SnfV3Book';
import Seo from '../../components/Seo';
import { useSnfV3 } from '../../context/SnfV3Context';
import { useAchievements } from '../../context/AchievementContext';
import { useBooks } from '../../hooks/useStoriesData';

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

const SnfV3ShelfPage = () => {
  const { language, setLanguage } = useSnfV3();
  const { unlockAchievement } = useAchievements();
  const { data: books, loading } = useBooks(language);
  const tr = language === 'tr';

  useEffect(() => {
    unlockAchievement('story_explorer');
  }, [unlockAchievement]);

  const shelves = useMemo(() => chunk(books || [], 4), [books]);

  return (
    <SnfV3Root>
      <Seo
        title="The Reading Room | From Serfs and Frauds"
        description="A warm reading room for From Serfs and Frauds — a neo-noir anthology in seven volumes."
        keywords={['serfs and frauds', 'reading room', 'bookstore', 'noir']}
      />
      <div className="snf3-room">
        {/* top utility */}
        <div className="relative z-10 flex items-center justify-between px-5 md:px-8 pt-5">
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity"
            style={{ color: '#f5efe2' }}
            title="Home"
          >
            <HouseIcon size={18} weight="fill" />
          </Link>
          <div
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: '#f5efe2' }}
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              style={{ opacity: language === 'en' ? 1 : 0.6 }}
            >
              EN
            </button>
            <span style={{ opacity: 0.35 }}>·</span>
            <button
              type="button"
              onClick={() => setLanguage('tr')}
              style={{ opacity: language === 'tr' ? 1 : 0.6 }}
            >
              TR
            </button>
          </div>
        </div>

        {/* hanging sign */}
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center pt-10 md:pt-14 pb-12 md:pb-16 px-5"
        >
          <div className="snf3-sign">
            <div className="text-[0.7rem] tracking-[0.42em] uppercase opacity-70">
              {tr ? 'Okuma Odası' : 'The Reading Room'}
            </div>
            <h1 className="text-[clamp(2.4rem,7vw,4.6rem)] mt-3 leading-none italic">
              Serfs &amp; Frauds
            </h1>
            <p className="mt-4 text-sm opacity-75">
              {tr
                ? 'Bir neo-noir antoloji · yedi cilt'
                : 'A neo-noir anthology · seven volumes'}
            </p>
          </div>
        </motion.header>

        {/* shelves */}
        <div className="relative z-10 max-w-5xl mx-auto pb-16 space-y-12 md:space-y-16">
          {loading && (
            <p className="text-center text-[#e7dbc1]/60 py-10">
              {tr ? 'kitaplar getiriliyor…' : 'bringing out the books…'}
            </p>
          )}
          {shelves.map((row, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + ri * 0.12 }}
              className="snf3-shelf"
            >
              <div className="snf3-shelf-books justify-center">
                {row.map((book) => (
                  <SnfV3Book key={book.bookId} book={book} language={language} />
                ))}
              </div>
              <div className="snf3-plank" />
            </motion.div>
          ))}
        </div>

        {/* footer */}
        <div
          className="relative z-10 text-center pb-12 text-xs"
          style={{ color: '#f5efe2', opacity: 0.85 }}
        >
          <div className="flex items-center justify-center gap-5">
            <Link to="/snf" className="hover:underline">
              {tr ? 'Terminal Edisyonu' : 'Terminal Edition'}
            </Link>
            <span style={{ opacity: 0.5 }}>·</span>
            <Link to="/stories" className="hover:underline">
              {tr ? 'Arşiv' : 'Archive'}
            </Link>
          </div>
          <div className="mt-3 italic" style={{ fontFamily: 'var(--snf3-serif)' }}>
            {tr ? 'rahatça oku' : 'read at your leisure'}
          </div>
        </div>
      </div>
    </SnfV3Root>
  );
};

export default SnfV3ShelfPage;
