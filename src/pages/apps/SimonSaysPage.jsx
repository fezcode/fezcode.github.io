import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowCounterClockwiseIcon,
  PlayIcon,
  TrophyIcon,
  ChartBarIcon,
  CirclesFourIcon,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const colorsList = [
  {
    id: 'green',
    color: 'bg-emerald-500',
    active: 'bg-emerald-300',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
  },
  {
    id: 'red',
    color: 'bg-rose-500',
    active: 'bg-rose-300',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.6)]',
  },
  {
    id: 'yellow',
    color: 'bg-amber-500',
    active: 'bg-amber-300',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]',
  },
  {
    id: 'blue',
    color: 'bg-sky-500',
    active: 'bg-sky-300',
    glow: 'shadow-[0_0_30px_rgba(14,165,233,0.6)]',
  },
];

const SimonSaysPage = () => {
  const appName = 'Simon Says';

  const { addToast } = useContext(ToastContext);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('simon_high_score') || '0');
  });

  const addToSequence = useCallback(() => {
    const randomColor =
      colorsList[Math.floor(Math.random() * colorsList.length)].id;
    setSequence((prev) => [...prev, randomColor]);
  }, []);

  const playSequence = useCallback(async (currentSequence) => {
    setIsPlaying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    for (let i = 0; i < currentSequence.length; i++) {
      const colorId = currentSequence[i];
      setActiveColor(colorId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActiveColor(null);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (gameActive && sequence.length > 0 && userSequence.length === 0) {
      playSequence(sequence);
    }
  }, [gameActive, sequence, userSequence.length, playSequence]);

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setSequence([]);
    setUserSequence([]);
    setTimeout(addToSequence, 200);
  };

  const handleColorClick = (colorId) => {
    if (!gameActive || isPlaying || gameOver) return;
    if (userSequence.length === sequence.length) return;

    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      setGameOver(true);
      setGameActive(false);
      addToast({
        message: 'SEQUENCE_TERMINATED: Error detected.',
        type: 'error',
      });
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simon_high_score', score.toString());
        addToast({ message: 'NEW_RECORD_ESTABLISHED', type: 'success' });
      }
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(sequence.length);
      setTimeout(() => {
        addToSequence();
        setUserSequence([]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Simon Says | Fezcodex"
        description="Test your memory by repeating the sequence of colors in this high-tech adaptation."
        keywords={[
          'Fezcodex',
          'simon says',
          'memory game',
          'color sequence',
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
          <BreadcrumbTitle title={appName} slug="simon" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Neural memory assessment. Replicate the generated{' '}
                <span className="text-emerald-400 font-bold">
                  light sequence
                </span>{' '}
                to proceed.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Active_Score
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  {score.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  System_Status
                </span>
                <span
                  className={`text-3xl font-black ${gameActive ? (isPlaying ? 'text-white' : 'text-emerald-500') : gameOver ? 'text-rose-500' : 'text-gray-700'}`}
                >
                  {gameActive
                    ? isPlaying
                      ? 'WATCHING'
                      : 'LISTENING'
                    : gameOver
                      ? 'TERMINATED'
                      : 'IDLE'}
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

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <ChartBarIcon weight="fill" />
                Session_Metrics
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="p-4 border border-white/5 bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      Highest_Seq
                    </span>
                    <TrophyIcon size={14} className="text-amber-500" />
                  </div>
                  <div className="text-3xl font-black font-mono">
                    {highScore.toString().padStart(2, '0')}
                  </div>
                </div>

                {!gameActive ? (
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                  >
                    <PlayIcon weight="bold" size={18} />
                    {gameOver ? 'REBOOT_SESSION' : 'INIT_SEQUENCE'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setGameActive(false);
                      setGameOver(true);
                    }}
                    className="w-full py-4 border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <ArrowCounterClockwiseIcon weight="bold" size={16} />
                    ABORT_SESSION
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <CirclesFourIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Protocol_Details
                </h4>
              </div>
              <ul className="space-y-3 text-xs font-mono text-gray-500 uppercase tracking-wider">
                <li className="flex gap-3">
                  <span className="text-emerald-500">01</span> Observation
                  phase: memorize the light pattern.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">02</span> Execution phase:
                  replicate the exact sequence.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">03</span> Sequence
                  increments by +1 per successful cycle.
                </li>
              </ul>
            </div>
          </div>

          {/* Game Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <CirclesFourIcon weight="fill" className="text-emerald-500" />
              Input_Matrix_Interface
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md aspect-square">
                {colorsList.map((color) => (
                  <motion.button
                    key={color.id}
                    whileHover={
                      gameActive && !isPlaying && !gameOver
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      gameActive && !isPlaying && !gameOver
                        ? { scale: 0.95 }
                        : {}
                    }
                    onClick={() => handleColorClick(color.id)}
                    disabled={!gameActive || isPlaying || gameOver}
                    className={`
                      relative aspect-square border-4 border-black/40 transition-all duration-150
                      ${activeColor === color.id ? `${color.active} ${color.glow} z-10 scale-[0.98]` : `${color.color} opacity-40`}
                      ${!gameActive || isPlaying || gameOver ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
                    `}
                  >
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    {activeColor === color.id && (
                      <motion.div
                        layoutId="active-glow"
                        className="absolute -inset-4 border border-white/20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimonSaysPage;
