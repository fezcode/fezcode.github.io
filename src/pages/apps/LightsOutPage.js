import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, LightbulbIcon, ArrowCounterClockwiseIcon, LightbulbFilamentIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { ToastContext } from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const LightsOutPage = () => {
  useSeo({
    title: 'Lights Out | Fezcodex',
    description: 'A classic logic puzzle game where you turn off all the lights.',
    keywords: ['Fezcodex', 'lights out', 'puzzle game', 'logic game', 'strategy game'],
    ogTitle: 'Lights Out | Fezcodex',
    ogDescription: 'A classic logic puzzle game where you turn off all the lights.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Lights Out | Fezcodex',
    twitterDescription: 'A classic logic puzzle game where you turn off all the lights.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useContext(ToastContext);

  const GRID_SIZE = 5;
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  // Function to initialize a solvable Lights Out grid
  const initGame = () => {
    let newGrid = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(false) // false means off
    );

    // To ensure solvability and a non-trivial starting state, apply random "clicks"
    // to a solved board. Each click guarantees a solvable state.
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (Math.random() < 0.3) { // Adjust probability for initial lights
          newGrid = toggleLight(i, j, newGrid, true); // Assign the returned new grid
        }
      }
    }
    setGrid(newGrid);
    setMoves(0);
    setGameOver(false);
    setMessage('');
  };

  useEffect(() => {
    initGame();
  }, []);

  // Toggles a light and its neighbors
  const toggleLight = (row, col, currentGrid, isInitialSetup = false) => {
    const newGrid = currentGrid.map(arr => [...arr]); // Deep copy

    const performToggle = (r, c) => {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        newGrid[r][c] = !newGrid[r][c];
      }
    };

    performToggle(row, col); // Toggle self
    performToggle(row - 1, col); // Toggle above
    performToggle(row + 1, col); // Toggle below
    performToggle(row, col - 1); // Toggle left
    performToggle(row, col + 1); // Toggle right

    if (!isInitialSetup) {
      setGrid(newGrid);
      setMoves(prevMoves => prevMoves + 1);
      if (checkWin(newGrid)) {
        setGameOver(true);
        setMessage(`You won in ${moves + 1} moves!`);
        addToast({ message: `You won in ${moves + 1} moves!`, type: 'success' });
      }
    } else {
      return newGrid; // Return the modified grid for initial setup
    }
  };

  // Checks if all lights are off
  const checkWin = (currentGrid) => {
    return currentGrid.every(row => row.every(light => !light));
  };

  const handleLightClick = (row, col) => {
    if (gameOver) return;
    toggleLight(row, col, grid);
  };

  const handleResetGame = () => {
    initGame();
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Lights Out" slug="lo" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="relative z-10 p-4">
              <h2 className="text-3xl font-arvo font-normal mb-2 text-app text-center">Lights Out</h2>
              <p className="text-center text-app-light mb-4">
                Turn off all the lights on the grid. Toggling a light also flips its neighbors!
              </p>
              <hr className="border-gray-700 mb-6" />

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-app-light">Moves: {moves}</span>
                <button
                  onClick={handleResetGame}
                  className="px-4 py-2 rounded-md font-semibold bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2"
                >
                  <ArrowCounterClockwiseIcon size={24} /> New Game
                </button>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md text-center font-semibold text-lg my-4
                    ${gameOver ? 'bg-green-700 text-green-100' : ''}
                    `}
                >
                  {message}
                </div>
              )}

              <div className="grid gap-1 mx-auto" style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: `${GRID_SIZE * 50}px` // Adjust grid container width based on cell size
              }}>
                {grid.map((row, rowIndex) => (
                  row.map((lightOn, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 rounded-md transition-colors duration-200 ease-in-out
                        ${lightOn ? 'bg-yellow-400 shadow-lg' : 'bg-gray-700'}
                        ${gameOver ? 'cursor-not-allowed' : ''}
                      `}
                      onClick={() => handleLightClick(rowIndex, colIndex)}
                      disabled={gameOver}
                      aria-label={`Light ${rowIndex}-${colIndex}`}
                    >
                      {lightOn && <LightbulbFilamentIcon size={24} className="mx-auto my-auto text-gray-900" />}
                    </button>
                  ))
                ))}
              </div>

              <div className="bg-app-alpha-10 border border-app-alpha-50 text-app p-4 mt-8 rounded-md">
                <div className="flex items-center mb-2">
                  <LightbulbIcon size={24} className="mr-3" />
                  <p className="font-bold">How to Play:</p>
                </div>
                <ul className="list-disc list-inside ml-5 text-sm">
                  <li>The goal is to turn off all the lights on the {GRID_SIZE}x{GRID_SIZE} grid.</li>
                  <li>Clicking a light toggles its state (on/off).</li>
                  <li>Crucially, clicking a light also toggles the state of its immediate neighbors (up, down, left, right).</li>
                  <li>Plan your moves carefully to solve the puzzle!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightsOutPage;
