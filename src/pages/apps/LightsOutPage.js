import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  ArrowCounterClockwiseIcon,
  LightbulbFilamentIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import useSeo from '../../hooks/useSeo';
import { ToastContext } from '../../context/ToastContext';
import GenerativeArt from '../../components/GenerativeArt';

const LightsOutPage = () => {
  const appName = 'Lights Out';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'A classic logic puzzle where you must deactivate all lighting nodes.',
    keywords: ['Fezcodex', 'lights out', 'puzzle', 'logic', 'game'],
  });

  const { addToast } = useContext(ToastContext);
  const GRID_SIZE = 5;
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const checkWin = useCallback((currentGrid) => {
    return currentGrid.length > 0 && currentGrid.every((row) => row.every((light) => !light));
  }, []);

  const toggleLight = useCallback((row, col, currentGrid, isInitialSetup = false) => {
    const newGrid = currentGrid.map((arr) => [...arr]);
    const performToggle = (r, c) => {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        newGrid[r][c] = !newGrid[r][c];
      }
    };

    performToggle(row, col);
    performToggle(row - 1, col);
    performToggle(row + 1, col);
    performToggle(row, col - 1);
    performToggle(row, col + 1);

    if (!isInitialSetup) {
      setGrid(newGrid);
      setMoves((prev) => {
        const next = prev + 1;
        if (checkWin(newGrid)) {
          setGameOver(true);
          setMessage(`System Shutdown Success :: Dark state achieved in ${next} moves.`);
          addToast({ message: `Puzzle solved in ${next} moves!`, type: 'success' });
        }
        return next;
      });
    } else {
      return newGrid;
    }
  }, [addToast, checkWin]);

  const initGame = useCallback(() => {
    let newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (Math.random() < 0.3) {
          newGrid = toggleLight(i, j, newGrid, true);
        }
      }
    }
    setGrid(newGrid);
    setMoves(0);
    setGameOver(false);
    setMessage('');
  }, [toggleLight]);

  useEffect(() => { initGame(); }, [initGame]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-20">
          <Link to="/apps" className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                {appName}
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Deactivate all nodes. Interacting with a node flips its state and all cardinal neighbors.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest">Interactions</span>
                  <span className="text-3xl font-black text-emerald-500">{moves}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest">Status</span>
                  <span className={`text-3xl font-black ${gameOver ? 'text-emerald-500' : 'text-white'}`}>
                    {gameOver ? 'OFFLINE' : 'POWERED'}
                  </span>
               </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Grid Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
             <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-12 md:p-24 rounded-sm overflow-hidden group w-full flex items-center justify-center">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                   <GenerativeArt seed={appName} className="w-full h-full" />
                </div>
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

                <div className="relative z-10">
                   <div
                      className="grid gap-2"
                      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                   >
                      {grid.map((row, r) => row.map((lightOn, c) => (
                        <button
                          key={`${r}-${c}`}
                          onClick={() => !gameOver && toggleLight(r, c, grid)}
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-sm transition-all duration-300 flex items-center justify-center
                            ${lightOn
                               ? 'bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.3)] scale-105'
                               : 'bg-white/5 text-gray-700 hover:bg-white/10 border border-white/5'
                            }
                            ${gameOver ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                          `}
                          disabled={gameOver}
                        >
                          {lightOn ? <LightbulbFilamentIcon size={32} weight="fill" /> : <div className="w-1 h-1 rounded-full bg-current opacity-20" />}
                        </button>
                      )))}
                   </div>
                </div>
             </div>

             <AnimatePresence>
                {message && (
                   <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 text-xl font-mono text-emerald-400 uppercase tracking-widest text-center"
                   >
                      {message}
                   </motion.p>
                )}
             </AnimatePresence>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 space-y-8">
             <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <div className="flex items-center gap-3 mb-6 text-emerald-500">
                   <LightbulbIcon size={20} weight="bold" />
                   <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">Operational Manual</h4>
                </div>
                <ul className="space-y-4 text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                   <li className="flex gap-3"><span className="text-emerald-500">01</span> Goal: Set all grid nodes to OFF state.</li>
                   <li className="flex gap-3"><span className="text-emerald-500">02</span> Toggle: Flips self and cardinal neighbors.</li>
                   <li className="flex gap-3"><span className="text-emerald-500">03</span> Efficiency: Minimise move count for optimal result.</li>
                </ul>
             </div>

             <div className="flex flex-col gap-3">
                <button
                  onClick={initGame}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                >
                  <ArrowCounterClockwiseIcon weight="bold" size={18} />
                  New Session
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LightsOutPage;
