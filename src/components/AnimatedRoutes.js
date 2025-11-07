import React from 'react';
import {Routes, Route, useLocation, Navigate} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from '../pages/HomePage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectPage from '../pages/ProjectPage';
import AboutPage from '../pages/AboutPage';
import LogsPage from '../pages/LogsPage';
import LogDetailPage from '../pages/LogDetailPage';
import NotFoundPage from '../pages/NotFoundPage';
import SeriesPage from '../pages/SeriesPage';
import DndPage from '../pages/DndPage';
import DndNotFoundPage from '../pages/DndNotFoundPage'; // New import
import DndEpisodePage from '../pages/DndEpisodePage'; // New import
import DndLorePage from '../pages/DndLorePage'; // New import
import DndBookPage from '../pages/DndBookPage'; // New import
import AppPage from '../pages/AppPage';
import IpPage from '../pages/apps/IpPage';
import WordCounterPage from '../pages/apps/WordCounterPage';
import TournamentBracketPage from '../pages/apps/TournamentBracketPage';
import CaseConverterPage from '../pages/apps/CaseConverterPage';
import Base64ConverterPage from '../pages/apps/Base64ConverterPage';
import UrlConverterPage from '../pages/apps/UrlConverterPage';
import AsciiConverterPage from '../pages/apps/AsciiConverterPage';
import HashGeneratorPage from '../pages/apps/HashGeneratorPage';
import UuidGeneratorPage from '../pages/apps/UuidGeneratorPage';
import ColorPaletteGeneratorPage from '../pages/apps/ColorPaletteGeneratorPage';
import CssUnitConverterPage from '../pages/apps/CssUnitConverterPage';
import FantasyNameGeneratorPage from '../pages/apps/FantasyNameGeneratorPage';
import DiceRollerPage from '../pages/apps/DiceRollerPage';

import UsefulLinksPage from '../pages/UsefulLinksPage';

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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/blog"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <BlogPage />
            </motion.div>
          }
        />
        <Route
          path="/blog/series/:seriesSlug/:episodeSlug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <BlogPostPage />
            </motion.div>
          }
        />
        <Route
          path="/blog/series/:seriesSlug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SeriesPage />
            </motion.div>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <BlogPostPage />
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProjectsPage />
            </motion.div>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProjectPage />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <AboutPage />
            </motion.div>
          }
        />
        <Route
          path="/logs"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LogsPage />
            </motion.div>
          }
        />
        <Route
          path="/logs/:slug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LogDetailPage />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotFoundPage />
            </motion.div>
          }
        />
        <Route
          path="/dnd"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DndPage />
            </motion.div>
          }
        />
        {/* D&D Lore Page */}
        <Route
          path="/dnd/lore"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DndLorePage />
            </motion.div>
          }
        />
        {/* D&D Book Page */}
        <Route
          path="/dnd/books/:bookId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DndBookPage />
            </motion.div>
          }
        />
        {/* D&D Episode Page */}
        <Route
          path="/dnd/books/:bookId/pages/:episodeId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DndEpisodePage />
            </motion.div>
          }
        />
        <Route
          path="/random"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <UsefulLinksPage />
            </motion.div>
          }
        />
        <Route
          path="/apps"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <AppPage />
            </motion.div>
          }
        />
        {/* Hardcoded redirects for fc::apps:: paths */}
        <Route path="/apps::ip" element={<Navigate to="/apps/ip" replace />} />
        <Route path="/apps::wc" element={<Navigate to="/apps/word-counter" replace />} />
        <Route path="/apps::tb" element={<Navigate to="/apps/tournament-bracket" replace />} />
        <Route path="/apps::cc" element={<Navigate to="/apps/case-converter" replace />} />
        <Route path="/apps::b64" element={<Navigate to="/apps/base64-converter" replace />} />
        <Route path="/apps::url" element={<Navigate to="/apps/url-converter" replace />} />
        <Route path="/apps::ascii" element={<Navigate to="/apps/ascii-converter" replace />} />
        <Route path="/apps::hash" element={<Navigate to="/apps/hash-generator" replace />} />
        <Route path="/apps::uuid" element={<Navigate to="/apps/uuid-generator" replace />} />
        <Route path="/apps::cpg" element={<Navigate to="/apps/color-palette-generator" replace />} />
        <Route path="/apps::css" element={<Navigate to="/apps/css-unit-converter" replace />} />
        <Route path="/apps::fng" element={<Navigate to="/apps/fantasy-name-generator" replace />} />
        <Route path="/apps::dice" element={<Navigate to="/apps/dice-roller" replace />} />
        {/* End of hardcoded redirects */}
        <Route
          path="/apps/ip"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <IpPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/word-counter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <WordCounterPage />
            </motion.div>
          }
        />

        <Route
          path="/apps/tournament-bracket"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TournamentBracketPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/case-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CaseConverterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/base64-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Base64ConverterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/url-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <UrlConverterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/ascii-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <AsciiConverterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/hash-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HashGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/uuid-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <UuidGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/color-palette-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ColorPaletteGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/css-unit-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CssUnitConverterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/fantasy-name-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <FantasyNameGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/dice-roller"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DiceRollerPage />
            </motion.div>
          }
        />
        {/* D&D specific 404 page */}
        <Route
          path="/dnd/*"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DndNotFoundPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
