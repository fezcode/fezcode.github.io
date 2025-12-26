import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, LightbulbIcon, TargetIcon, ClockIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const MastermindPage = () => {
  const appName = 'Mastermind';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Play the classic code-breaking game of Mastermind.',
    keywords: [
      'Fezcodex',
      'mastermind',
      'bulls and cows',
      'game',
      'logic game',
    ],
  });

  const { addToast } = useToast();
  const [secretCode, setSecretCode] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const MAX_GUESSES = 10;

  const generateSecretCode = useCallback(() => {
    let digits = '0123456789'.split('');
    let code = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      code += digits.splice(randomIndex, 1)[0];
    }
    setSecretCode(code);
  }, []);

  useEffect(() => {
    generateSecretCode();
  }, [generateSecretCode]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (gameOver) return;

    if (
      currentGuess.length !== 4 ||
      !/^\d{4}$/.test(currentGuess) ||
      new Set(currentGuess).size !== 4
    ) {
      addToast({
        title: 'Input Error',
        message: 'Enter 4 unique digits.',
        duration: 3000,
      });
      return;
    }

    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < 4; i++) {
      if (currentGuess[i] === secretCode[i]) {
        bulls++;
      } else if (secretCode.includes(currentGuess[i])) {
        cows++;
      }
    }

    const newGuesses = [
      { guess: currentGuess, bulls, cows, id: Date.now() },
      ...guesses,
    ];
    setGuesses(newGuesses);

    if (bulls === 4) {
      setGameOver(true);
      setMessage(`ACCESS_GRANTED :: Code identified as ${secretCode}`);
      addToast({
        title: 'Success',
        message: 'Target cracked!',
        type: 'success',
      });
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setMessage(`ACCESS_DENIED :: Secret code was ${secretCode}`);
      addToast({
        title: 'System Lock',
        message: 'Too many failed attempts.',
        type: 'error',
      });
    }

    setCurrentGuess('');
  };

  const handleResetGame = () => {
    generateSecretCode();
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Mastermind" slug="mm" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Heuristic optimization protocol. Decode the sequence via
                iterative logical inference.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Action Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <TargetIcon weight="fill" />
                Input_Module
              </h3>

              {!gameOver ? (
                <form
                  onSubmit={handleGuessSubmit}
                  className="flex flex-col gap-8 relative z-10"
                >
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      Enter 4 Unique Digits
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      value={currentGuess}
                      onChange={(e) =>
                        setCurrentGuess(e.target.value.replace(/[^0-9]/g, ''))
                      }
                      className="bg-transparent border-b-2 border-white/10 py-4 text-5xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors tracking-[0.5em] text-center"
                      placeholder="0000"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                  >
                    <LightbulbIcon weight="bold" size={18} />
                    Validate
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 relative z-10">
                  <p className="text-xl font-mono text-emerald-400 mb-8 leading-relaxed uppercase">
                    {message}
                  </p>
                  <button
                    onClick={handleResetGame}
                    className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all text-sm"
                  >
                    Re-Initialise
                  </button>
                </div>
              )}
            </div>

            <div className="border border-white/5 p-6 rounded-sm bg-black/40 font-mono text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed">
              <p>Bulls: Correct digit, correct position.</p>
              <p className="mt-1">Cows: Correct digit, incorrect position.</p>
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <ClockIcon weight="fill" className="text-emerald-500" />
              Transmission_History
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto no-scrollbar">
                <table className="w-full text-left font-mono">
                  <thead className="sticky top-0 bg-[#050505] z-10 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">
                        #
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">
                        Sequence
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-600 tracking-widest text-center">
                        Bulls
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-600 tracking-widest text-center">
                        Cows
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence initial={false}>
                      {guesses.map((g, index) => (
                        <motion.tr
                          key={g.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-600 text-xs">
                            {guesses.length - index}
                          </td>
                          <td className="px-6 py-4 text-white font-black text-xl tracking-[0.2em]">
                            {g.guess}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black">
                              {g.bulls}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black">
                              {g.cows}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {guesses.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-20 text-center text-gray-700 uppercase tracking-widest text-xs"
                        >
                          No transmissions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MastermindPage;
