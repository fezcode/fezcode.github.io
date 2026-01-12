import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  XIcon,
  EraserIcon,
  LightbulbIcon,
  ShapesIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const PUZZLES = [
  [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  [
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
  ],
  [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  [
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
  ],
];

const PUZZLENAMES = [
  'Heart',
  'Fez',
  'Diamond',
  'Cross',
  'House',
  'Smile',
  'Letter N',
  'Checker',
  'Plus',
  'Arrow',
  'Tree',
  'Fish',
  'Letter U',
  'Target',
  'Stairs',
  'Face',
  'Letter A',
  'Star',
  'Spiral',
  'Mushroom',
  'Rook',
  'Hollow',
  'Boat',
];

const generateClues = (puzzle) => {
  const numRows = puzzle.length;
  const numCols = puzzle[0].length;
  const rowClues = [];
  const colClues = [];
  for (let r = 0; r < numRows; r++) {
    const row = puzzle[r];
    let current = [];
    let size = 0;
    for (let c = 0; c < numCols; c++) {
      if (row[c] === 1) size++;
      else if (size > 0) {
        current.push(size);
        size = 0;
      }
    }
    if (size > 0) current.push(size);
    rowClues.push(current.length > 0 ? current : [0]);
  }
  for (let c = 0; c < numCols; c++) {
    let current = [];
    let size = 0;
    for (let r = 0; r < numRows; r++) {
      if (puzzle[r][c] === 1) size++;
      else if (size > 0) {
        current.push(size);
        size = 0;
      }
    }
    if (size > 0) current.push(size);
    colClues.push(current.length > 0 ? current : [0]);
  }
  return { rowClues, colClues };
};

const NonogramPage = () => {
  const appName = 'Nonogram';

  const { addToast } = useContext(ToastContext);
  const [solvedPuzzle, setSolvedPuzzle] = useState([]);
  const [playerGrid, setPlayerGrid] = useState([]);
  const [rowClues, setRowClues] = useState([]);
  const [colClues, setColClues] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('');
  const [puzzleName, setPuzzleName] = useState('');

  const initGame = useCallback(() => {
    const idx = Math.floor(Math.random() * PUZZLES.length);
    const puzzle = PUZZLES[idx];
    setPuzzleName(PUZZLENAMES[idx]);
    setSolvedPuzzle(puzzle);
    const { rowClues: r, colClues: c } = generateClues(puzzle);
    setRowClues(r);
    setColClues(c);
    setPlayerGrid(
      Array(puzzle.length)
        .fill(null)
        .map(() => Array(puzzle[0].length).fill(0)),
    );
    setGameWon(false);
    setMessage('');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const checkWin = useCallback(() => {
    if (solvedPuzzle.length === 0) return false;
    for (let r = 0; r < solvedPuzzle.length; r++) {
      for (let c = 0; c < solvedPuzzle[0].length; c++) {
        if (playerGrid[r][c] === 1 && solvedPuzzle[r][c] !== 1) return false;
        if (playerGrid[r][c] === 0 && solvedPuzzle[r][c] === 1) return false;
      }
    }
    return true;
  }, [playerGrid, solvedPuzzle]);

  useEffect(() => {
    if (playerGrid.length > 0 && solvedPuzzle.length > 0 && checkWin()) {
      setGameWon(true);
      setMessage(`Pattern Identified :: ${puzzleName} decrypted.`);
      addToast({
        title: 'Success',
        message: 'Puzzle Solved!',
        type: 'success',
      });
    }
  }, [playerGrid, solvedPuzzle, checkWin, addToast, puzzleName]);

  const handleCellClick = (row, col, event) => {
    if (gameWon) return;
    event.preventDefault();
    setPlayerGrid((prev) => {
      const next = prev.map((r) => [...r]);
      if (event.type === 'contextmenu')
        next[row][col] = next[row][col] === 2 ? 0 : 2;
      else next[row][col] = next[row][col] === 1 ? 0 : 1;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Nonogram | Fezcodex"
        description="Solve complex picture logic puzzles using numerical identifiers."
        keywords={['Fezcodex', 'nonogram', 'puzzle', 'logic', 'game']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Nonogram" slug="ng" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Picture logic protocol. Decrypt the pattern through grid-based
                identification.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Target
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  {puzzleName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Status
                </span>
                <span
                  className={`text-3xl font-black ${gameWon ? 'text-emerald-500' : 'text-white'}`}
                >
                  {gameWon ? 'SOLVED' : 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Action Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-16 rounded-sm overflow-hidden group w-full flex items-center justify-center">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt
                  seed={appName + puzzleName}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <div className="relative z-10">
                {/* Nonogram Grid Container */}
                <div className="flex flex-col items-center">
                  <div className="flex">
                    <div className="w-20 h-20" />
                    <div className="flex gap-1">
                      {colClues.map((clues, i) => (
                        <div
                          key={i}
                          className="w-10 h-20 flex flex-col-reverse items-center justify-end font-mono text-[10px] text-gray-500 border-b border-white/5 pb-2"
                        >
                          {clues.map((c, j) => (
                            <span key={j}>{c}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col gap-1 pr-4">
                      {rowClues.map((clues, i) => (
                        <div
                          key={i}
                          className="h-10 w-20 flex items-center justify-end font-mono text-[10px] text-gray-500 border-r border-white/5 pr-2"
                        >
                          {clues.map((c, j) => (
                            <span key={j} className="ml-1">
                              {c}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${solvedPuzzle[0]?.length || 5}, 40px)`,
                      }}
                    >
                      {playerGrid.map((row, r) =>
                        row.map((cell, c) => (
                          <button
                            key={`${r}-${c}`}
                            onClick={(e) => handleCellClick(r, c, e)}
                            onContextMenu={(e) => handleCellClick(r, c, e)}
                            className={`w-10 h-10 border border-white/10 rounded-sm transition-all duration-150 flex items-center justify-center
                                     ${cell === 1 ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 hover:bg-white/10'}
                                     ${gameWon && solvedPuzzle[r][c] === 1 ? 'bg-white text-black border-white scale-95' : ''}
                                  `}
                          >
                            {cell === 2 && (
                              <XIcon size={16} className="text-gray-600" />
                            )}
                          </button>
                        )),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <p className="mt-8 text-xl font-mono text-emerald-400 uppercase tracking-widest text-center">
                {message}
              </p>
            )}
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
              <div className="flex items-center gap-3 mb-6 text-emerald-500">
                <LightbulbIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Logic_Manual
                </h4>
              </div>
              <ul className="space-y-4 text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-emerald-500">01</span> Fill cells based
                  on row/column numbers.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">02</span> Numbers represent
                  consecutive filled blocks.
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-500">03</span> Left-click to
                  fill, Right-click to mark empty space.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={initGame}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
              >
                <ShapesIcon weight="bold" size={18} />
                New Pattern
              </button>
              <button
                onClick={() =>
                  setPlayerGrid(
                    Array(solvedPuzzle.length)
                      .fill(null)
                      .map(() => Array(solvedPuzzle[0].length).fill(0)),
                  )
                }
                className="w-full py-3 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <EraserIcon />
                Clear Current
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonogramPage;
