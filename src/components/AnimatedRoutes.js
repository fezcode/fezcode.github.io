import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from './Loading';

// Lazy Imports
const HomePage = lazy(() => import('../pages/HomePage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogPostPage = lazy(() => import('../pages/BlogPostPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const LogsPage = lazy(() => import('../pages/LogsPage'));
const LogDetailPage = lazy(() => import('../pages/LogDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const SeriesPage = lazy(() => import('../pages/SeriesPage'));
const DndPage = lazy(() => import('../pages/dnd/DndPage'));
const DndNotFoundPage = lazy(() => import('../pages/dnd/DndNotFoundPage'));
const DndEpisodePage = lazy(() => import('../pages/dnd/DndEpisodePage'));
const DndLorePage = lazy(() => import('../pages/dnd/DndLorePage'));
const DndBookPage = lazy(() => import('../pages/dnd/DndBookPage'));
const DndAuthorsPage = lazy(() => import('../pages/dnd/DndAuthorsPage'));
const AppPage = lazy(() => import('../pages/AppPage'));
const IpPage = lazy(() => import('../pages/apps/IpPage'));
const WordCounterPage = lazy(() => import('../pages/apps/WordCounterPage'));
const TournamentBracketPage = lazy(
  () => import('../pages/apps/TournamentBracketPage'),
);
const CaseConverterPage = lazy(() => import('../pages/apps/CaseConverterPage'));
const Base64ConverterPage = lazy(
  () => import('../pages/apps/Base64ConverterPage'),
);
const UrlConverterPage = lazy(() => import('../pages/apps/UrlConverterPage'));
const AsciiConverterPage = lazy(
  () => import('../pages/apps/AsciiConverterPage'),
);
const HashGeneratorPage = lazy(() => import('../pages/apps/HashGeneratorPage'));
const UuidGeneratorPage = lazy(() => import('../pages/apps/UuidGeneratorPage'));
const ColorPaletteGeneratorPage = lazy(
  () => import('../pages/apps/ColorPaletteGeneratorPage'),
);
const CssUnitConverterPage = lazy(
  () => import('../pages/apps/CssUnitConverterPage'),
);
const FantasyNameGeneratorPage = lazy(
  () => import('../pages/apps/FantasyNameGeneratorPage'),
);
const DiceRollerPage = lazy(() => import('../pages/apps/DiceRollerPage'));
const PickerWheelPage = lazy(() => import('../pages/apps/PickerWheelPage'));
const CodenameGeneratorPage = lazy(
  () => import('../pages/apps/CodenameGeneratorPage'),
);
const ImageToolkitPage = lazy(() => import('../pages/apps/ImageToolkitPage'));
const PasswordGeneratorPage = lazy(
  () => import('../pages/apps/PasswordGeneratorPage'),
);
const JsonFormatterPage = lazy(() => import('../pages/apps/JsonFormatterPage'));
const ColorContrastCheckerPage = lazy(
  () => import('../pages/apps/ColorContrastCheckerPage'),
);
const QrCodeGeneratorPage = lazy(
  () => import('../pages/apps/QrCodeGeneratorPage'),
);
const JsonPimlConverterPage = lazy(
  () => import('../pages/apps/JsonPimlConverterPage'),
);
const TextDiffCheckerPage = lazy(
  () => import('../pages/apps/TextDiffCheckerPage'),
);
const CronJobGeneratorPage = lazy(
  () => import('../pages/apps/CronJobGeneratorPage'),
);
const ExcuseGeneratorPage = lazy(
  () => import('../pages/apps/ExcuseGeneratorPage'),
);
const MagicEightBallPage = lazy(
  () => import('../pages/apps/MagicEightBallPage'),
);
const JSONGeneratorPage = lazy(() => import('../pages/apps/JSONGeneratorPage'));
const CardGamePage = lazy(() => import('../pages/apps/CardGamePage'));
const SoccerPongPage = lazy(() => import('../pages/apps/SoccerPongPage'));
const MemoryGamePage = lazy(() => import('../pages/apps/MemoryGamePage'));
const RockPaperScissorsPage = lazy(
  () => import('../pages/apps/RockPaperScissorsPage'),
);
const TicTacToePage = lazy(() => import('../pages/apps/TicTacToePage'));
const ConnectFourPage = lazy(() => import('../pages/apps/ConnectFourPage'));
const ImageCompressorPage = lazy(
  () => import('../pages/apps/ImageCompressorPage'),
);
const StopwatchAppPage = lazy(() => import('../pages/apps/StopwatchAppPage'));
const PomodoroTimerPage = lazy(() => import('../pages/apps/PomodoroTimerPage'));
const MorseCodeTranslatorPage = lazy(
  () => import('../pages/apps/MorseCodeTranslatorPage'),
);
const MastermindPage = lazy(() => import('../pages/apps/MastermindPage'));
const WordLadderPage = lazy(() => import('../pages/apps/WordLadderPage'));
const LightsOutPage = lazy(() => import('../pages/apps/LightsOutPage'));
const NonogramPage = lazy(() => import('../pages/apps/NonogramPage'));
const WhackABugPage = lazy(() => import('../pages/apps/WhackABugPage'));
const BubbleWrapPage = lazy(() => import('../pages/apps/BubbleWrapPage'));
const LoremIpsumGeneratorPage = lazy(
  () => import('../pages/apps/LoremIpsumGeneratorPage'),
);
const SimonSaysPage = lazy(() => import('../pages/apps/SimonSaysPage'));
const BananaConverterPage = lazy(
  () => import('../pages/apps/BananaConverterPage'),
);
const PirateTranslatorPage = lazy(
  () => import('../pages/apps/PirateTranslatorPage'),
);
const GalacticAgePage = lazy(() => import('../pages/apps/GalacticAgePage'));
const BpmGuesserPage = lazy(() => import('../pages/apps/BpmGuesserPage'));
const WhiteboardPage = lazy(() => import('../pages/apps/WhiteboardPage'));
const FootballEmblemCreatorPage = lazy(
  () => import('../pages/apps/FootballEmblemCreatorPage'),
);
const RoguelikeGamePage = lazy(() => import('../pages/apps/RoguelikeGamePage'));
const TcgCardGeneratorPage = lazy(
  () => import('../pages/apps/TcgCardGeneratorPage'),
);
const KeyboardTypingSpeedTesterPage = lazy(
  () => import('../pages/apps/KeyboardTypingSpeedTesterPage'),
);
const NotepadPage = lazy(() => import('../pages/apps/NotepadPage'));
const CozyAppPage = lazy(() => import('../pages/apps/CozyAppPage'));
const SpirographPage = lazy(() => import('../pages/apps/SpirographPage'));
const FractalFloraPage = lazy(() => import('../pages/apps/FractalFloraPage'));
const AbstractWavesPage = lazy(() => import('../pages/apps/AbstractWavesPage'));
const TopographicMapPage = lazy(() => import('../pages/apps/TopographicMapPage'));
const RotaryPhonePage = lazy(() => import('../pages/apps/RotaryPhonePage'));
const FezynthPage = lazy(() => import('../pages/apps/FezynthPage'));
const CodeSeancePage = lazy(() => import('../pages/apps/CodeSeancePage'));
const RoadmapViewerPage = lazy(() => import('../pages/roadmap/FezzillaPage'));
const RoadmapItemDetailPage = lazy(() => import('../pages/roadmap/RoadmapItemDetailPage'));
const PinnedAppPage = lazy(() => import('../pages/PinnedAppPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const TimelinePage = lazy(() => import('../pages/TimelinePage'));
const RandomPage = lazy(() => import('../pages/RandomPage'));
const NotebooksPage = lazy(() => import('../pages/notebooks/NotebooksPage'));
const NotebookViewerPage = lazy(
  () => import('../pages/notebooks/NotebookViewerPage'),
);
const NewsPage = lazy(() => import('../pages/NewsPage'));
const CommandsPage = lazy(() => import('../pages/CommandsPage'));
const AchievementsPage = lazy(() => import('../pages/AchievementsPage'));

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
    <AnimatePresence>
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
              <Suspense fallback={<Loading />}>
                <HomePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <BlogPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <BlogPostPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <SeriesPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <BlogPostPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ProjectsPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ProjectPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <AboutPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <SettingsPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/timeline" // New route for TimelinePage
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <TimelinePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <LogsPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/logs/:category/:slugId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <LogDetailPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <NotebooksPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <NotebookViewerPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <NotFoundPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DndPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DndLorePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DndBookPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DndEpisodePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DndAuthorsPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <RandomPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <NewsPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <AppPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/commands"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <CommandsPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/achievements"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <AchievementsPage />
              </Suspense>
            </motion.div>
          }
        />
        {/* Hardcoded redirects for fc::apps:: paths */}
        <Route
          path="/apps::pinned"
          element={<Navigate to="/pinned-apps" replace />}
        />
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
        <Route
          path="/apps::wab"
          element={<Navigate to="/apps/whack-a-bug" replace />}
        />
        <Route
          path="/apps::simon"
          element={<Navigate to="/apps/simon-says" replace />}
        />
        <Route
          path="/apps::pop"
          element={<Navigate to="/apps/bubble-wrap" replace />}
        />
        <Route
          path="/apps::lorem"
          element={<Navigate to="/apps/lorem-ipsum-generator" replace />}
        />
        <Route
          path="/apps::banana"
          element={<Navigate to="/apps/banana-converter" replace />}
        />
        <Route
          path="/apps::pirate"
          element={<Navigate to="/apps/pirate-translator" replace />}
        />
        <Route
          path="/apps::space"
          element={<Navigate to="/apps/galactic-age" replace />}
        />
        <Route
          path="/apps::bpm"
          element={<Navigate to="/apps/bpm-guesser" replace />}
        />
        <Route
          path="/apps::draw"
          element={<Navigate to="/apps/whiteboard" replace />}
        />
        <Route
          path="/apps::emblem"
          element={<Navigate to="/apps/football-emblem-creator" replace />}
        />
        <Route
          path="/apps::fec"
          element={<Navigate to="/apps/football-emblem-creator" replace />}
        />
        <Route
          path="/apps::rl"
          element={<Navigate to="/apps/roguelike-game" replace />}
        />
        <Route
          path="/apps::tcg"
          element={<Navigate to="/apps/tcg-card-generator" replace />}
        />
        <Route
          path="/apps::ft"
          element={<Navigate to="/apps/feztype" replace />}
        />
        <Route
          path="/apps::fz"
          element={<Navigate to="/apps/fezynth" replace />}
        />
        <Route
          path="/apps::seance"
          element={<Navigate to="/apps/seance" replace />}
        />
        <Route
          path="/apps::np"
          element={<Navigate to="/apps/notepad" replace />}
        />
        <Route
          path="/apps::spiro"
          element={<Navigate to="/apps/spirograph" replace />}
        />
        <Route
          path="/apps::flora"
          element={<Navigate to="/apps/fractal-flora" replace />}
        />
        <Route
          path="/apps::aw"
          element={<Navigate to="/apps/abstract-waves" replace />}
        />
        <Route
          path="/apps::topo"
          element={<Navigate to="/apps/topographic-maps" replace />}
        />
        <Route
          path="/apps::phone"
          element={<Navigate to="/apps/rotary-phone" replace />}
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
              <Suspense fallback={<Loading />}>
                <IpPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/feztype"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <KeyboardTypingSpeedTesterPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/tcg-card-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <TcgCardGeneratorPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/fezynth"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <FezynthPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/seance"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <CodeSeancePage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/roguelike-game"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <RoguelikeGamePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ConnectFourPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <TicTacToePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <RockPaperScissorsPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <CardGamePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <SoccerPongPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <MemoryGamePage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <CronJobGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ExcuseGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <MagicEightBallPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <TextDiffCheckerPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <JSONGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <WordCounterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <TournamentBracketPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <CaseConverterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <Base64ConverterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <UrlConverterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <AsciiConverterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <HashGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <UuidGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ColorPaletteGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <CssUnitConverterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <FantasyNameGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DiceRollerPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <PickerWheelPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <CodenameGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ImageToolkitPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <PasswordGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <JsonFormatterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ColorContrastCheckerPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <QrCodeGeneratorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <JsonPimlConverterPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <ImageCompressorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <StopwatchAppPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <PomodoroTimerPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <MorseCodeTranslatorPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <MastermindPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <WordLadderPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <LightsOutPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <NonogramPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/whack-a-bug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <WhackABugPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/simon-says"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <SimonSaysPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/bubble-wrap"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <BubbleWrapPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/lorem-ipsum-generator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <LoremIpsumGeneratorPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/banana-converter"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <BananaConverterPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/pirate-translator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <PirateTranslatorPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/galactic-age"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <GalacticAgePage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/bpm-guesser"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <BpmGuesserPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/whiteboard"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <WhiteboardPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/football-emblem-creator"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <FootballEmblemCreatorPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/notepad"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <NotepadPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/cozy-corner"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <CozyAppPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/spirograph"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <SpirographPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/fractal-flora"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <FractalFloraPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/abstract-waves"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <AbstractWavesPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/apps/topographic-maps"
          element={
            <Suspense fallback={<Loading />}>
              <TopographicMapPage />
            </Suspense>
          }
        />
        <Route
          path="/apps/rotary-phone"
          element={
            <Suspense fallback={<Loading />}>
              <RotaryPhonePage />
            </Suspense>
          }
        />
        <Route
          path="/roadmap"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <RoadmapViewerPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/roadmap/:id"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <RoadmapItemDetailPage />
              </Suspense>
            </motion.div>
          }
        />
        {/*Pinned Apps*/}
        <Route
          path="/pinned-apps"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Suspense fallback={<Loading />}>
                <PinnedAppPage />
              </Suspense>
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
              <Suspense fallback={<Loading />}>
                <DndNotFoundPage />
              </Suspense>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
