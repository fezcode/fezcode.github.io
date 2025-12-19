import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  HandshakeIcon,
  UserIcon,
  CpuIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

const choices = [
  { name: 'Rock', emoji: '🪨' },
  { name: 'Paper', emoji: '📄' },
  { name: 'Scissors', emoji: '✂️' },
];

const RockPaperScissorsPage = () => {
  const appName = 'Rock Paper Scissors';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Play the classic game of Rock Paper Scissors against the neural network.',
    keywords: ['Fezcodex', 'rock paper scissors', 'game', 'fun app'],
  });

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const { addToast } = useToast();

  const determineWinner = useCallback(
    (pChoice, cChoice) => {
      if (pChoice.name === cChoice.name) {
        setResult("Consensus Reached :: It's a tie.");
      } else if (
        (pChoice.name === 'Rock' && cChoice.name === 'Scissors') ||
        (pChoice.name === 'Paper' && cChoice.name === 'Rock') ||
        (pChoice.name === 'Scissors' && cChoice.name === 'Paper')
      ) {
        setResult('Strategic Victory :: You win.');
        setPlayerScore((prev) => prev + 1);
        addToast({
          title: 'Victory',
          message: 'You defeated the machine.',
          type: 'success',
        });
      } else {
        setResult('System Overload :: Computer wins.');
        setComputerScore((prev) => prev + 1);
        addToast({
          title: 'Defeat',
          message: 'The machine prevails.',
          type: 'error',
        });
      }
    },
    [addToast],
  );

  useEffect(() => {
    if (playerChoice !== null) {
      const computerRandomChoice =
        choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerRandomChoice);
      determineWinner(playerChoice, computerRandomChoice);
    }
  }, [playerChoice, determineWinner]);

  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
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

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                R.P.S
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-sm uppercase tracking-widest">
                Neural engagement protocol. Select your vector.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <UserIcon
                    size={12}
                    weight="bold"
                    className="text-emerald-500"
                  />{' '}
                  Player
                </span>
                <span className="text-3xl font-black text-white">
                  {playerScore}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <CpuIcon size={12} weight="bold" className="text-rose-500" />{' '}
                  Neural
                </span>
                <span className="text-3xl font-black text-white">
                  {computerScore}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Choices Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed="RPS" className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <HandshakeIcon weight="fill" />
                Select_Option
              </h3>

              <div className="grid grid-cols-1 gap-4 relative z-10">
                {choices.map((choice) => (
                  <button
                    key={choice.name}
                    onClick={() => handlePlayerChoice(choice)}
                    className={`
                           flex items-center justify-between p-6 border transition-all duration-300 rounded-sm group/btn
                           ${
                             playerChoice?.name === choice.name
                               ? 'bg-white text-black border-white'
                               : 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10'
                           }
                        `}
                  >
                    <span className="text-4xl">{choice.emoji}</span>
                    <span className="font-black uppercase tracking-[0.2em] text-lg">
                      {choice.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setPlayerScore(0);
                setComputerScore(0);
                resetGame();
              }}
              className="w-full py-3 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ArrowCounterClockwiseIcon />
              Reset Sessions
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {playerChoice ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full border border-white/10 bg-white/[0.01] rounded-sm p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <GenerativeArt seed={result} className="w-full h-full" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-8 w-full">
                    <div className="flex items-center justify-center gap-16 w-full">
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">
                          You
                        </span>
                        <div className="text-8xl">{playerChoice.emoji}</div>
                      </div>
                      <div className="text-2xl font-mono text-gray-700 font-black">
                        VS
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">
                          System
                        </span>
                        <div className="text-8xl">{computerChoice?.emoji}</div>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-emerald-400 mb-8">
                        {result}
                      </h2>
                      <button
                        onClick={resetGame}
                        className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all"
                      >
                        Next Round
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-white/10 border-dashed rounded-sm flex items-center justify-center p-12 text-center">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-600">
                    Waiting for player input...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissorsPage;
