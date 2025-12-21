import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  Timer,
  Target,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import '../../styles/MemoryGamePage.css';
import { useAchievements } from '../../context/AchievementContext';
import GenerativeArt from '../../components/GenerativeArt';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const CARD_VALUES = ['🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍓', '🍉'];

const MemoryGamePage = () => {
  useSeo({
    title: 'Memory Game | Fezcodex',
    description: 'A classic memory game to test your concentration.',
    keywords: [
      'Fezcodex',
      'memory game',
      'match pairs',
      'brain game',
      'concentration',
    ],
    ogTitle: 'Memory Game | Fezcodex',
    ogDescription: 'A classic memory game to test your concentration.',
    ogImage: '/images/asset/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Memory Game | Fezcodex',
    twitterDescription: 'A classic memory game to test your concentration.',
    twitterImage: '/images/asset/ogtitle.png',
  });

  const { unlockAchievement } = useAchievements();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const shuffleCards = useCallback((values) => {
    let id = 0;
    const initialCards = [...values, ...values].map((value) => ({
      id: id++,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }
    return initialCards;
  }, []);

  const initializeGame = useCallback(() => {
    const shuffledCards = shuffleCards(CARD_VALUES);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchesFound(0);
    setMoves(0);
    setGameOver(false);
    setGameStarted(false);
    setStartTime(null);
  }, [shuffleCards]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };

  const handleCardClick = useCallback(
    (clickedCard) => {
      if (
        !gameStarted ||
        gameOver ||
        clickedCard.isFlipped ||
        clickedCard.isMatched ||
        flippedCards.length === 2
      ) {
        return;
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === clickedCard.id ? { ...card, isFlipped: true } : card,
        ),
      );
      setFlippedCards((prev) => [...prev, clickedCard.id]);
    },
    [gameStarted, gameOver, flippedCards.length],
  );

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card,
            ),
          );
          setMatchesFound((prev) => prev + 1);
          setFlippedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card,
            ),
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchesFound === CARD_VALUES.length && gameStarted) {
      setGameOver(true);
      const duration = (Date.now() - startTime) / 1000;
      if (duration < 45) unlockAchievement('combo_breaker');
      if (moves <= 24) unlockAchievement('sharp_eye');
      if (moves <= 18) unlockAchievement('eidetic_memory');
      if (moves <= 14) unlockAchievement('mind_palace');
    }
  }, [matchesFound, moves, unlockAchievement, startTime, gameStarted]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 pb-32 relative font-sans">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden border-b border-white/10">
        <GenerativeArt
          seed="Memory Protocol"
          className="w-full h-full opacity-40 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
          <div className="mb-6 flex items-center gap-4">
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft weight="bold" />
              <span>Back to Apps</span>
            </Link>
            <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-1.5 rounded-full bg-emerald-500/5 backdrop-blur-sm flex items-center gap-2">
              <Brain size={14} /> COGNITIVE_TEST_STATION
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none max-w-5xl">
            Memory Game
          </h1>
          <p className="mt-4 text-gray-400 font-mono text-sm max-w-xl">
            Identification and pattern matching protocol. Secure{' '}
            {CARD_VALUES.length} pairs to complete the sequence.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-8">
          <div className="memory-game-area relative">
            {/* Overlay for start/end */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/5 p-12 text-center">
                <div className="max-w-md">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">
                    Initialise Protocol
                  </h2>
                  <p className="text-gray-400 font-mono text-sm mb-12">
                    Click below to begin the pattern identification sequence.
                  </p>
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                  >
                    <Target weight="bold" size={18} />
                    Execute_Start
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md border border-emerald-500/20 p-12 text-center">
                <div className="max-w-md">
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
                    <ArrowsClockwise
                      size={48}
                      weight="bold"
                      className="animate-spin-slow"
                    />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-emerald-400">
                    Success
                  </h2>
                  <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-12">
                    Total_Moves: {moves} {'//'} Data_Integrity: 100%
                  </p>
                  <button
                    onClick={initializeGame}
                    className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all text-sm"
                  >
                    Re-Initialise
                  </button>
                </div>
              </div>
            )}

            <div
              className={`cards-grid ${!gameStarted || gameOver ? 'opacity-20 pointer-events-none' : ''}`}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="memory-card-inner">
                    <div className="memory-card-face memory-card-back bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                      <div className="w-4 h-4 border border-white/20 rotate-45" />
                    </div>
                    <div className="memory-card-face memory-card-front bg-emerald-500 text-black border border-emerald-400">
                      {card.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-16 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            <div>
              <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {'//'} SESSION_METRICS
              </h3>
              <div className="space-y-6 border-l border-white/10 pl-6">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Target size={12} /> Move_Count
                  </span>
                  <span className="font-mono text-2xl uppercase text-white font-black">
                    {moves}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <ArrowsClockwise size={12} /> Sequence_Matches
                  </span>
                  <span className="font-mono text-2xl uppercase text-emerald-500 font-black">
                    {matchesFound}
                    <span className="text-gray-700 text-lg">
                      /{CARD_VALUES.length}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Timer size={12} /> Uptime
                  </span>
                  <span className="font-mono text-sm uppercase text-white font-bold">
                    {startTime
                      ? Math.floor((Date.now() - startTime) / 1000)
                      : 0}
                    S
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
                Instructions
              </h4>
              <ul className="space-y-3 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                <li>• Select any two modules to reveal their identifiers.</li>
                <li>• If module values align, module is secured.</li>
                <li>
                  • Align all modules to complete the identification protocol.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGamePage;
