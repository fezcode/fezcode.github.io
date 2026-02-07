import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CardsThreeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsClockwiseIcon,
  TrophyIcon,
  ChartBarIcon,
  EyeIcon,
  TargetIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';
import { useAchievements } from '../../context/AchievementContext';

const suits = ['♠', '♥', '♦', '♣'];
const ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

const getDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, value: ranks.indexOf(rank) + 2 });
    }
  }
  return shuffleDeck(deck);
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const CardGamePage = () => {
  const appName = 'Higher or Lower';

  const { addToast } = useContext(ToastContext);
  const { unlockAchievement } = useAchievements();
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startGame = useCallback(() => {
    const newDeck = getDeck();
    const firstCard = newDeck.pop();
    setDeck(newDeck);
    setCurrentCard(firstCard);
    setNextCard(null);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    addToast({ message: 'DECK_INITIALIZED: Sequence ready.', type: 'info' });
  }, [addToast]);

  useEffect(() => {
    if (!gameStarted) {
      startGame();
    }
  }, [gameStarted, startGame]);

  const handleGuess = async (guess) => {
    if (gameOver || !currentCard || isProcessing) return;

    setIsProcessing(true);
    const drawnNextCard = deck.pop();
    setDeck([...deck]);
    setNextCard(drawnNextCard);

    // Short delay for visual tension
    await new Promise((resolve) => setTimeout(resolve, 600));

    const isHigher = drawnNextCard.value > currentCard.value;
    const isLower = drawnNextCard.value < currentCard.value;
    const isSame = drawnNextCard.value === currentCard.value;

    let correct = false;
    if (guess === 'higher' && isHigher) correct = true;
    else if (guess === 'lower' && isLower) correct = true;
    else if (isSame) {
      addToast({
        message: 'PROBABILITY_STALEMATE: Value parity detected.',
        type: 'warning',
      });
      setCurrentCard(drawnNextCard);
      setNextCard(null);
      setIsProcessing(false);
      return;
    }

    if (correct) {
      setScore((s) => s + 1);
      setCurrentCard(drawnNextCard);
      setNextCard(null);
      addToast({ message: 'PREDICTION_VERIFIED', type: 'success' });
    } else {
      setGameOver(true);
      if (score > 20) unlockAchievement('legendary_gambler');
      if (score > 14) unlockAchievement('high_roller');
      if (score > 7) unlockAchievement('card_shark');
      addToast({
        message: 'PREDICTION_FAILED: Sequence terminated.',
        type: 'error',
      });
    }
    setIsProcessing(false);
  };

  const renderCard = (card, isNext = false) => {
    if (!card)
      return (
        <div className="w-32 h-48 md:w-40 md:h-56 border-2 border-dashed border-white/10 rounded-sm flex items-center justify-center bg-white/[0.02]">
          <span className="font-mono text-4xl font-black text-white/5 uppercase">
            Null
          </span>
        </div>
      );

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <motion.div
        initial={isNext ? { y: 20, opacity: 0 } : { scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        className={`w-32 h-48 md:w-40 md:h-56 bg-white border-4 border-black rounded-sm relative flex flex-col justify-between p-4 shadow-[8px_8px_0px_rgba(16,185,129,0.2)] ${isRed ? 'text-rose-600' : 'text-black'}`}
      >
        <div className="flex flex-col items-start leading-none">
          <span className="text-2xl font-black font-mono">{card.rank}</span>
          <span className="text-xl">{card.suit}</span>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl">
          {card.suit}
        </div>
        <div className="flex flex-col items-end leading-none rotate-180">
          <span className="text-2xl font-black font-mono">{card.rank}</span>
          <span className="text-xl">{card.suit}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Higher or Lower | Fezcodex"
        description="Guess if the next card is higher or lower in this high-contrast tactical environment."
        keywords={[
          'Fezcodex',
          'card game',
          'higher or lower',
          'game',
          'brutalist',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>
          <BreadcrumbTitle title={appName} slug="card" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Probability forecasting protocol. Predict the next{' '}
                <span className="text-emerald-400 font-bold">
                  numerical value
                </span>{' '}
                within the shuffled sequence.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Score_Chain
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  {score.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Deck_Remaining
                </span>
                <span className="text-3xl font-black text-white">
                  {deck.length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <TargetIcon weight="fill" />
                Decision_Matrix
              </h3>

              <div className="space-y-6 relative z-10">
                {!gameOver ? (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => handleGuess('higher')}
                      disabled={isProcessing}
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-3"
                    >
                      <ArrowUpIcon weight="bold" size={20} />
                      Predict_Higher
                    </button>
                    <button
                      onClick={() => handleGuess('lower')}
                      disabled={isProcessing}
                      className="w-full py-6 border-2 border-white text-white font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-3"
                    >
                      <ArrowDownIcon weight="bold" size={20} />
                      Predict_Lower
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startGame}
                    className="w-full py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] hover:bg-rose-500 transition-all text-sm flex items-center justify-center gap-3"
                  >
                    <ArrowsClockwiseIcon weight="bold" size={20} />
                    Reboot_Sequence
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <ChartBarIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Tactical_Metrics
                </h4>
              </div>
              <ul className="space-y-3 text-xs font-mono text-gray-500 uppercase tracking-wider">
                <li className="flex gap-3">
                  <span className="text-emerald-500">01</span> ACE ranks as 14
                  (Highest).
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">02</span> Matching values
                  result in a DRAW (Safety).
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">03</span> Goal: Maximize
                  chain length without failure.
                </li>
              </ul>
            </div>
          </div>

          {/* Matrix Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500" />
              Observation_Deck
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
              <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="flex flex-col items-center gap-4">
                  <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em]">
                    Current_Base
                  </span>
                  {renderCard(currentCard)}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`text-4xl font-black font-mono transition-colors ${isProcessing ? 'text-emerald-500 animate-pulse' : 'text-white/10'}`}
                  >
                    VS
                  </div>
                  <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em]">
                    Prediction_Target
                  </span>
                  <AnimatePresence mode="wait">
                    {nextCard ? (
                      renderCard(nextCard, true)
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {renderCard(null, true)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {gameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center p-8"
                >
                  <div className="text-center space-y-6">
                    <TrophyIcon
                      size={64}
                      weight="fill"
                      className="mx-auto text-rose-500"
                    />
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black font-mono uppercase tracking-tighter text-rose-500">
                        System_Failure
                      </h2>
                      <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                        Final_Yield: {score}
                      </p>
                    </div>
                    <button
                      onClick={startGame}
                      className="px-8 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                    >
                      Initialize_New_Session
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-[0.5em] text-gray-500">
                <span className="flex items-center gap-2">
                  <CardsThreeIcon /> LOCAL_SESSION_ACTIVE
                </span>
                <span>HL_v4.0.2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGamePage;
