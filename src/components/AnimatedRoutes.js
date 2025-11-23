import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import DndPage from '../pages/dnd/DndPage';
import DndNotFoundPage from '../pages/dnd/DndNotFoundPage';
import DndEpisodePage from '../pages/dnd/DndEpisodePage';
import DndLorePage from '../pages/dnd/DndLorePage';
import DndBookPage from '../pages/dnd/DndBookPage';
import DndAuthorsPage from '../pages/dnd/DndAuthorsPage'; // Import DndAuthorsPage
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
import PickerWheelPage from '../pages/apps/PickerWheelPage';
import CodenameGeneratorPage from '../pages/apps/CodenameGeneratorPage';
import ImageToolkitPage from '../pages/apps/ImageToolkitPage';
import PasswordGeneratorPage from '../pages/apps/PasswordGeneratorPage';
import JsonFormatterPage from '../pages/apps/JsonFormatterPage';
import ColorContrastCheckerPage from '../pages/apps/ColorContrastCheckerPage';
import QrCodeGeneratorPage from '../pages/apps/QrCodeGeneratorPage';
import JsonPimlConverterPage from '../pages/apps/JsonPimlConverterPage';
import TextDiffCheckerPage from '../pages/apps/TextDiffCheckerPage';
import CronJobGeneratorPage from '../pages/apps/CronJobGeneratorPage';
import ExcuseGeneratorPage from '../pages/apps/ExcuseGeneratorPage';
import MagicEightBallPage from '../pages/apps/MagicEightBallPage';
import JSONGeneratorPage from '../pages/apps/JSONGeneratorPage';
import CardGamePage from '../pages/apps/CardGamePage';
import SoccerPongPage from '../pages/apps/SoccerPongPage';
import MemoryGamePage from '../pages/apps/MemoryGamePage'; // Import MemoryGamePage
import RockPaperScissorsPage from '../pages/apps/RockPaperScissorsPage'; // Import RockPaperScissorsPage
import TicTacToePage from '../pages/apps/TicTacToePage'; // Import TicTacToePage
import ConnectFourPage from '../pages/apps/ConnectFourPage'; // Import ConnectFourPage
import ImageCompressorPage from '../pages/apps/ImageCompressorPage'; // Import ImageCompressorPage
import StopwatchAppPage from '../pages/StopwatchAppPage'; // Import StopwatchAppPage
import PomodoroTimerPage from '../pages/apps/PomodoroTimerPage';
import MorseCodeTranslatorPage from '../pages/apps/MorseCodeTranslatorPage';
import MastermindPage from '../pages/apps/MastermindPage';
import WordLadderPage from '../pages/apps/WordLadderPage'; // Import WordLadderPage
import LightsOutPage from '../pages/apps/LightsOutPage'; // Import LightsOutPage
import NonogramPage from '../pages/apps/NonogramPage'; // Import NonogramPage
import SettingsPage from '../pages/SettingsPage';

import UsefulLinksPage from '../pages/UsefulLinksPage';
import NotebooksPage from '../pages/notebooks/NotebooksPage';
import NotebookViewerPage from '../pages/notebooks/NotebookViewerPage';
import NewsPage from '../pages/NewsPage'; // Import NewsPage

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
          path="/settings" // New route for SettingsPage
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SettingsPage />
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
          path="/notebooks"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotebooksPage />
            </motion.div>
          }
        />
        <Route
          path="/notebooks/:notebookId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotebookViewerPage />
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
          path="/stories"
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
          path="/stories/lore"
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
          path="/stories/books/:bookId"
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
          path="/stories/books/:bookId/pages/:episodeId"
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
        {/* D&D Authors Page */}
        <Route
          path="/stories/authors"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DndAuthorsPage />
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
          path="/news" // New route for NewsPage
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NewsPage />
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
        <Route
          path="/apps::wc"
          element={<Navigate to="/apps/word-counter" replace />}
        />
        <Route
          path="/apps::tb"
          element={<Navigate to="/apps/tournament-bracket" replace />}
        />
        <Route
          path="/apps::cc"
          element={<Navigate to="/apps/case-converter" replace />}
        />
        <Route
          path="/apps::b64"
          element={<Navigate to="/apps/base64-converter" replace />}
        />
        <Route
          path="/apps::url"
          element={<Navigate to="/apps/url-converter" replace />}
        />
        <Route
          path="/apps::ascii"
          element={<Navigate to="/apps/ascii-converter" replace />}
        />
        <Route
          path="/apps::hash"
          element={<Navigate to="/apps/hash-generator" replace />}
        />
        <Route
          path="/apps::uuid"
          element={<Navigate to="/apps/uuid-generator" replace />}
        />
        <Route
          path="/apps::cpg"
          element={<Navigate to="/apps/color-palette-generator" replace />}
        />
        <Route
          path="/apps::css"
          element={<Navigate to="/apps/css-unit-converter" replace />}
        />
        <Route
          path="/apps::fng"
          element={<Navigate to="/apps/fantasy-name-generator" replace />}
        />
        <Route
          path="/apps::dice"
          element={<Navigate to="/apps/dice-roller" replace />}
        />
        <Route
          path="/apps::pw"
          element={<Navigate to="/apps/picker-wheel" replace />}
        />
        <Route
          path="/apps::cg"
          element={<Navigate to="/apps/codename-generator" replace />}
        />
        <Route
          path="/apps::itk"
          element={<Navigate to="/apps/image-toolkit" replace />}
        />
        <Route
          path="/apps::pg"
          element={<Navigate to="/apps/password-generator" replace />}
        />
        <Route
          path="/apps::jf"
          element={<Navigate to="/apps/json-formatter" replace />}
        />
        <Route
          path="/apps::ccc"
          element={<Navigate to="/apps/color-contrast-checker" replace />}
        />
        <Route
          path="/apps::qr"
          element={<Navigate to="/apps/qr-code-generator" replace />}
        />
        <Route
          path="/apps::jpc"
          element={<Navigate to="/apps/json-piml-converter" replace />}
        />
        <Route
          path="/apps::jg"
          element={<Navigate to="/apps/json-generator" replace />}
        />
        <Route
          path="/apps::tdc"
          element={<Navigate to="/apps/text-diff-checker" replace />}
        />
        <Route
          path="/apps::cron"
          element={<Navigate to="/apps/cron-job-generator" replace />}
        />
        <Route
          path="/apps::imc"
          element={<Navigate to="/apps/image-compressor" replace />}
        />
        <Route
          path="/apps::excuse"
          element={<Navigate to="/apps/excuse-generator" replace />}
        />
        <Route
          path="/apps::8ball"
          element={<Navigate to="/apps/magic-8-ball" replace />}
        />
        <Route
          path="/apps::card"
          element={<Navigate to="/apps/card-game" replace />}
        />
        <Route
          path="/apps::sp"
          element={<Navigate to="/apps/soccer-pong" replace />}
        />
        <Route
          path="/apps::mg"
          element={<Navigate to="/apps/memory-game" replace />}
        />
        <Route
          path="/apps::rps"
          element={<Navigate to="/apps/rock-paper-scissors" replace />}
        />
        <Route
          path="/apps::ttt"
          element={<Navigate to="/apps/tic-tac-toe" replace />}
        />
        <Route
          path="/apps::c4"
          element={<Navigate to="/apps/connect-four" replace />}
        />
        <Route
          path="/apps::sw"
          element={<Navigate to="/apps/stopwatch" replace />}
        />
        <Route
          path="/apps::pomodoro"
          element={<Navigate to="/apps/pomodoro-timer" replace />}
        />
        <Route
          path="/apps::mct"
          element={<Navigate to="/apps/morse-code-translator" replace />}
        />
        <Route
          path="/apps::mm"
          element={<Navigate to="/apps/mastermind" replace />}
        />
        <Route
          path="/apps::wl"
          element={<Navigate to="/apps/word-ladder" replace />}
        />
        <Route
          path="/apps::lo"
          element={<Navigate to="/apps/lights-out" replace />}
        />
        <Route
          path="/apps::ng"
          element={<Navigate to="/apps/nonogram" replace />}
        />
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
          path="/apps/connect-four"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ConnectFourPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/tic-tac-toe"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TicTacToePage />
            </motion.div>
          }
        />
        <Route
          path="/apps/rock-paper-scissors"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <RockPaperScissorsPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/card-game"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CardGamePage />
            </motion.div>
          }
        />
        <Route
          path="/apps/soccer-pong"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SoccerPongPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/memory-game"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <MemoryGamePage />
            </motion.div>
          }
        />
        <Route
          path="/apps/cron-job-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CronJobGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/excuse-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ExcuseGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/magic-8-ball"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <MagicEightBallPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/text-diff-checker"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TextDiffCheckerPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/json-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <JSONGeneratorPage />
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
        <Route
          path="/apps/picker-wheel"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PickerWheelPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/codename-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CodenameGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/image-toolkit"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ImageToolkitPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/password-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PasswordGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/json-formatter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <JsonFormatterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/color-contrast-checker"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ColorContrastCheckerPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/qr-code-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <QrCodeGeneratorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/json-piml-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <JsonPimlConverterPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/image-compressor"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ImageCompressorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/stopwatch"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <StopwatchAppPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/pomodoro-timer"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PomodoroTimerPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/morse-code-translator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <MorseCodeTranslatorPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/mastermind"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <MastermindPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/word-ladder"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <WordLadderPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/lights-out"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LightsOutPage />
            </motion.div>
          }
        />
        <Route
          path="/apps/nonogram"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NonogramPage />
            </motion.div>
          }
        />
        {/* D&D specific 404 page */}
        <Route
          path="/stories/*"
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
