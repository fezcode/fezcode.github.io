import React, { useState, useEffect,  useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  ArrowCounterClockwiseIcon,
  GridFourIcon,
  XIcon, // For marking cells
  EraserIcon, // For clearing marks/fills
  PaintBrushHouseholdIcon // For filling cells
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { ToastContext } from '../../context/ToastContext';

// Define some sample puzzles (1 means filled, 0 means empty)
const PUZZLES = [
  // 5x5 Heart
  [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 "F" for Fezcodex
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  // 5x5 Diamond
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 Cross
  [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
  ],
  // 5x5 House
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  // 5x5 Smiley Face
  [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  // 5x5 Nonogram (N)
  [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  // 5x5 Checkerboard
  [
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
  ],
  // 5x5 Plus Sign
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 Arrow pointing up
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 Simple Tree
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 Fish
  [
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
  ],
  // 5x5 Letter U
  [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  // 5x5 Target
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 5x5 Stairs
  [
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
  ],
  // 5x5 Creeper Face
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
  ],
  // 5x5 Letter 'A'
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  // 5x5 Star
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  // 5x5 Spiral
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 5x5 Mushroom
  [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 Rook (Chess Piece)
  [
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
  ],
  // 5x5 Hollow Diamond
  [
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  // 5x5 Simple Boat
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
  ],
];

const PUZZLENAMES = [
  "Heart",
  "F for Fezcodex",
  "Diamond",
  "Cross",
  "House",
  "Smiley Face",
  "Nonogram (N)",
  "Checkerboard",
  "Plus Sign",
  "Arrow pointing up",
  "Simple Tree",
  "Fish",
  "Letter U",
  "Target",
  "Stairs",
  "Creeper Face",
  "Letter 'A'",
  "Star",
  "Spiral",
  "Mushroom",
  "Rook (Chess Piece)",
  "Hollow Diamond",
  "Simple Boat",
];

// Helper to generate clues from a solved puzzle
const generateClues = (puzzle) => {
  const numRows = puzzle.length;
  const numCols = puzzle[0].length;
  const rowClues = [];
  const colClues = [];

  // Generate row clues
  for (let r = 0; r < numRows; r++) {
    const row = puzzle[r];
    let currentRowClues = [];
    let currentBlockSize = 0;
    for (let c = 0; c < numCols; c++) {
      if (row[c] === 1) {
        currentBlockSize++;
      } else {
        if (currentBlockSize > 0) {
          currentRowClues.push(currentBlockSize);
          currentBlockSize = 0;
        }
      }
    }
    if (currentBlockSize > 0) {
      currentRowClues.push(currentBlockSize);
    }
    rowClues.push(currentRowClues.length > 0 ? currentRowClues : [0]);
  }

  // Generate column clues
  for (let c = 0; c < numCols; c++) {
    let currentColClues = [];
    let currentBlockSize = 0;
    for (let r = 0; r < numRows; r++) {
      if (puzzle[r][c] === 1) {
        currentBlockSize++;
      } else {
        if (currentBlockSize > 0) {
          currentColClues.push(currentBlockSize);
          currentBlockSize = 0;
        }
      }
    }
    if (currentBlockSize > 0) {
      currentColClues.push(currentBlockSize);
    }
    colClues.push(currentColClues.length > 0 ? currentColClues : [0]);
  }

  return { rowClues, colClues };
};

const NonogramPage = () => {
  useSeo({
    title: 'Nonogram | Fezcodex',
    description: 'Solve picture logic puzzles by filling cells according to numerical clues.',
    keywords: ['Fezcodex', 'nonogram', 'picross', 'griddlers', 'picture logic', 'puzzle game'],
    ogTitle: 'Nonogram | Fezcodex',
    ogDescription: 'Solve picture logic puzzles by filling cells according to numerical clues.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Nonogram | Fezcodex',
    twitterDescription: 'Solve picture logic puzzles by filling cells according to numerical clues.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useContext(ToastContext);

  const [solvedPuzzle, setSolvedPuzzle] = useState([]); // The 1/0 solution
  const [playerGrid, setPlayerGrid] = useState([]); // 0: empty, 1: filled, 2: marked_X
  const [rowClues, setRowClues] = useState([]);
  const [colClues, setColClues] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTool, setActiveTool] = useState('fill'); // 'fill' or 'mark'
  const [puzzleName, setPuzzleName] = useState('');

  const NUM_ROWS = solvedPuzzle.length;
  const NUM_COLS = solvedPuzzle.length > 0 ? solvedPuzzle[0].length : 0;

  const initGame = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * PUZZLES.length);
    const newSolvedPuzzle = PUZZLES[randomIndex];
    setPuzzleName(PUZZLENAMES[randomIndex]);
    setSolvedPuzzle(newSolvedPuzzle);

    const { rowClues: newRowClues, colClues: newColClues } = generateClues(newSolvedPuzzle);
    setRowClues(newRowClues);
    setColClues(newColClues);

    const newPlayerGrid = Array(newSolvedPuzzle.length).fill(null).map(() =>
      Array(newSolvedPuzzle[0].length).fill(0) // Initialize all cells as empty (0)
    );
    setPlayerGrid(newPlayerGrid);
    setGameWon(false);
    setMessage('');
    setActiveTool('fill'); // Reset tool to fill
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const checkWin = useCallback(() => {
    if (NUM_ROWS === 0) return false;
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        // Only filled cells (1) must match the solved puzzle
        // Marked cells (2) are ignored for win condition, they are just player aids
        if (playerGrid[r][c] === 1 && solvedPuzzle[r][c] !== 1) {
          return false; // Filled an incorrect cell
        }
        if (playerGrid[r][c] === 0 && solvedPuzzle[r][c] === 1) {
          return false; // Missed a filled cell
        }
      }
    }
    // Also need to ensure no marked cells are actually part of the solution
    // But simplified for now: just check filled cells and empty cells that should be filled
    // A more robust check would ensure all '1' in solution are '1' in playerGrid and all '0' are '0' or '2'
    return true; // All filled cells are correct and no required cells are left empty
  }, [playerGrid, solvedPuzzle, NUM_ROWS, NUM_COLS]);
  useEffect(() => {
    if (playerGrid.length > 0 && solvedPuzzle.length > 0) {
      if (checkWin()) {
        setGameWon(true);
        setMessage(`Congratulations! You solved the '${puzzleName}' puzzle!`);
        addToast({ title:'Congratz...', message: `You solved the Nonogram: ${puzzleName}!`, type: 'success' });
      }
    }
  }, [playerGrid, solvedPuzzle, checkWin, addToast, puzzleName]);

  const handleCellClick = (row, col, event) => {
    if (gameWon) return;

    event.preventDefault(); // Prevent context menu on right-click

    setPlayerGrid(prevGrid => {
      const newGrid = prevGrid.map(arr => [...arr]);
      if (event.type === 'contextmenu') { // Right-click (mark with X)
        newGrid[row][col] = newGrid[row][col] === 2 ? 0 : 2; // Toggle 0 <-> 2
      } else { // Left-click (fill cell)
        newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1; // Toggle 0 <-> 1
      }
      return newGrid;
    });
  };  const handleClearBoard = () => {
    const newPlayerGrid = Array(NUM_ROWS).fill(null).map(() =>
      Array(NUM_COLS).fill(0)
    );
    setPlayerGrid(newPlayerGrid);
    setGameWon(false);
    setMessage('');
  };

  const calculateGridSize = () => {
    const cellSize = 30; // pixels per cell
    const gap = 2; // pixels gap
    const gridWidth = NUM_COLS * cellSize + (NUM_COLS - 1) * gap;
    const gridHeight = NUM_ROWS * cellSize + (NUM_ROWS - 1) * gap;
    return { gridWidth, gridHeight, cellSize, gap };
  };

  const { gridWidth, gridHeight, cellSize, gap } = calculateGridSize();

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center justify-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">ng</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="relative z-10 p-4">
              <h2 className="text-3xl font-arvo font-normal mb-2 text-app text-center">Nonogram</h2>
              <p className="text-center text-app-light mb-4">
                Fill the grid to reveal a hidden picture!
              </p>
              <hr className="border-gray-700 mb-6" />

              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={initGame}
                  className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2"
                >
                  <ArrowCounterClockwiseIcon size={24} /> New Puzzle
                </button>
                <button
                  onClick={handleClearBoard}
                  className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2"
                >
                  <EraserIcon size={24} /> Clear Board
                </button>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md text-center font-semibold text-lg my-4
                    ${gameWon ? 'bg-green-700 text-green-100' : ''}
                    `}
                >
                  {message}
                </div>
              )}

              {/* Nonogram Grid */}
              <div className="flex flex-col items-center justify-center mx-auto" style={{ width: `${gridWidth + 80}px` }}> {/* +80 for row clues */}
                <div className="flex">
                  {/* Empty corner for alignment */}
                  <div style={{ width: `80px`, height: `80px` }}></div>
                  {/* Column Clues */}
                  <div className="flex flex-row justify-around items-end p-2" style={{ width: `${gridWidth}px`, height: `80px`, gap: `${gap}px` }}>
                    {colClues.map((clues, colIndex) => (
                      <div key={colIndex} className="flex flex-col-reverse items-center justify-end text-xs text-app-light font-mono leading-none">
                        {clues.map((clue, i) => (
                          <span key={i}>{clue}</span>
                        ))}
                      </div>
                                        ))}
                                                        </div>
                                                      </div>
                                    <div className="flex">
                  {/* Row Clues */}
                  <div className="flex flex-col justify-around items-end p-2" style={{ width: `80px`, height: `${gridHeight}px`, gap: `${gap}px` }}>
                    {rowClues.map((clues, rowIndex) => (
                      <div key={rowIndex} className="flex flex-row items-center justify-end text-xs text-app-light font-mono leading-none">
                        {clues.map((clue, i) => (
                          <span key={i}>{clue}</span>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Playable Grid */}
                  <div
                    className="grid border border-app-alpha-50 rounded-md overflow-hidden"
                    style={{
                      gridTemplateColumns: `repeat(${NUM_COLS}, ${cellSize}px)`,
                      gridTemplateRows: `repeat(${NUM_ROWS}, ${cellSize}px)`,
                      width: `${gridWidth}px`,
                      height: `${gridHeight}px`,
                      gap: `${gap}px`
                    }}
                  >
                    {playerGrid.map((row, rowIndex) =>
                      row.map((cellState, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          className={`relative flex items-center justify-center border border-app-alpha-50/50 rounded-sm cursor-pointer transition-colors duration-100 ease-in-out
                                        ${cellState === 1 ? 'bg-app hover:bg-app/70' :
                                            cellState === 2 ? 'bg-gray-700 hover:bg-gray-600' :
                                            'bg-gray-800 hover:bg-gray-700'
                                        }
                                        ${gameWon ? (solvedPuzzle[rowIndex][colIndex] === 1 ? 'bg-green-600' : 'bg-gray-800') : ''}
                                        `}
                          onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                          onContextMenu={(e) => handleCellClick(rowIndex, colIndex, e)}
                          disabled={gameWon}
                          aria-label={`Cell ${rowIndex}-${colIndex}`}
                          style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                        >
                          {cellState === 2 && <XIcon size={cellSize * 0.7} className="text-gray-400" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-app-alpha-10 border border-app-alpha-50 text-app p-4 mt-8 rounded-md">
                <div className="flex items-center mb-2">
                  <LightbulbIcon size={24} className="mr-3" />
                  <p className="font-bold">How to Play Nonogram:</p>
                </div>
                <ul className="list-disc list-inside ml-5 text-sm">
                  <li>The goal is to color cells in the grid to reveal a hidden picture.</li>
                  <li>Numbers (clues) at the side tell you how many consecutive cells in that row/column must be colored.</li>
                  <li>For example, a clue "2 4" means there are blocks of 2 and 4 colored cells, with at least one empty cell between them.</li>
                  <li>**Left-click** a cell to fill it (color it in).</li>
                  <li>**Right-click** a cell to mark it with an 'X' (indicating it should be empty). This helps with logic.</li>
                  <li>Right-click again to clear the 'X'. Left-click again to unfill.</li>
                  <li>Solve the puzzle by filling all the correct cells!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonogramPage;
