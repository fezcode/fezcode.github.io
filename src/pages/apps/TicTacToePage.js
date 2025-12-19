import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, XIcon, CircleIcon, ArrowsClockwiseIcon, CpuIcon, UserIcon } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

const TicTacToePage = () => {
  const appName = 'Tic Tac Toe';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Protocol for strategic grid alignment. Challenge the neural AI in a classic logical confrontation.',
    keywords: ['Fezcodex', 'tic tac toe', 'game', 'ai game', 'strategy'],
  });

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const { addToast } = useToast();

  const handleClick = useCallback((i) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }, [board, winner, xIsNext]);

  const minimax = useCallback((currentBoard, depth, isMaximizingPlayer) => {
    const result = calculateWinner(currentBoard);
    if (result === 'X') return -10 + depth;
    if (result === 'O') return 10 - depth;
    if (currentBoard.every(Boolean)) return 0;

    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'O';
          let score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'X';
          let score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, []);

  const findBestMove = useCallback((currentBoard) => {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O';
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }, [minimax]);

  const makeAiMove = useCallback(() => {
    const bestMove = findBestMove(board);
    if (bestMove !== null) handleClick(bestMove);
  }, [board, handleClick, findBestMove]);

  useEffect(() => {
    if (!xIsNext && !winner) {
      const timer = setTimeout(() => makeAiMove(), 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, winner, makeAiMove]);

  useEffect(() => {
    const calculatedWinner = calculateWinner(board);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      addToast({ title: 'Game Over', message: `${calculatedWinner} has secured the grid.` });
    } else if (board.every(Boolean)) {
      setWinner('Draw');
      addToast({ title: 'Grid Lock', message: "No dominant sequence identified." });
    }
  }, [board, addToast]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Neural grid protocol. Engage in archetypal pattern matching against the system's recursive decision matrix.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Game Area */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-16 rounded-sm overflow-hidden group flex flex-col items-center justify-center w-full max-w-2xl">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + winner + board.join('')} className="w-full h-full" />
              </div>

              <div className="relative z-10 w-full flex flex-col items-center gap-12">
                {/* Board */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 p-4 bg-black/40 border border-white/5 rounded-sm shadow-inner">
                  {board.map((square, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(i)}
                      disabled={winner || square || (!xIsNext && !winner)}
                      className={`
                        w-20 h-20 md:w-32 md:h-32 flex items-center justify-center border-4 transition-all duration-300
                        ${square === 'X' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' :
                          square === 'O' ? 'border-white bg-white/5 text-white' :
                          'border-white/5 hover:border-emerald-500/30 bg-black/20'}
                        ${(winner || square) ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <AnimatePresence mode="wait">
                        {square === 'X' && (
                          <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                            <XIcon size={48} weight="black" />
                          </motion.div>
                        )}
                        {square === 'O' && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <CircleIcon size={48} weight="bold" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <button
                    onClick={resetGame}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  >
                    <ArrowsClockwiseIcon weight="bold" size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Clear Grid</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <CpuIcon weight="fill" />
                Protocol_Status
              </h3>

              <div className="space-y-8">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">Current_Control</span>
                  <div className="flex items-center gap-3">
                    {xIsNext ? <UserIcon size={20} className="text-emerald-500" /> : <CpuIcon size={20} className="text-white" />}
                    <span className="text-xl font-black uppercase">{xIsNext ? 'User_Alpha' : 'System_AI'}</span>
                  </div>
                </div>

                <div className={`p-6 border rounded-sm flex flex-col gap-2 transition-all duration-500 ${winner ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                  <span className="font-mono text-[10px] text-gray-600 uppercase">Outcome_Registry</span>
                  <span className={`text-xl font-black uppercase ${winner === 'X' ? 'text-emerald-500' : 'text-white'}`}>
                    {winner ? (winner === 'Draw' ? 'Lockdown' : `${winner === 'X' ? 'User' : 'AI'}_Wins`) : 'Pending...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                The minimax algorithm ensures the system AI maintains an optimal strategic posture. Achieving victory requires identifying subtle structural vulnerabilities in the recursive logic.
              </p>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Strategy_Loom_v0.6.1</span>
          <span className="text-gray-800">MATRIX_STATUS // {winner ? 'TERMINATED' : 'ACTIVE'}</span>
        </footer>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

export default TicTacToePage;