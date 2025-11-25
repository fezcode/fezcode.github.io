import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, CirclesFourIcon} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import '../../styles/SimonSaysPage.css';

const colorsList = ['green', 'red', 'yellow', 'blue'];

const SimonSaysPage = () => {
  useSeo({
    title: 'Simon Says | Fezcodex',
    description: 'Test your memory by repeating the sequence of colors.',
    keywords: ['Fezcodex', 'simon says', 'memory game', 'color sequence', 'game'],
    ogTitle: 'Simon Says | Fezcodex',
    ogDescription: 'Test your memory by repeating the sequence of colors.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Simon Says | Fezcodex',
    twitterDescription: 'Test your memory by repeating the sequence of colors.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // Machine is playing sequence
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Refs for timeout management
  const timeoutRef = useRef(null);

  const playTone = (color) => {
    // Placeholder for sound - for now just visual
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 300);
  };

  const addToSequence = useCallback(() => {
    const randomColor = colorsList[Math.floor(Math.random() * colorsList.length)];
    setSequence((prev) => [...prev, randomColor]);
  }, []);

  const playSequence = useCallback(async (currentSequence) => {
    setIsPlaying(true);
    // Small delay before starting
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < currentSequence.length; i++) {
      const color = currentSequence[i];
      setActiveColor(color);
      await new Promise(resolve => setTimeout(resolve, 500)); // Light duration
      setActiveColor(null);
      await new Promise(resolve => setTimeout(resolve, 200)); // Gap between lights
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
    // Initial move
    setTimeout(() => {
      const randomColor = colorsList[Math.floor(Math.random() * colorsList.length)];
      setSequence([randomColor]);
    }, 100);
  };

  const handleColorClick = (color) => {
    if (!gameActive || isPlaying || gameOver) return;
    // Prevent clicks if we are waiting for the next sequence
    if (userSequence.length === sequence.length) return;

    playTone(color);
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check validity
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      setGameOver(true);
      setGameActive(false);
      return;
    }

    // Check completion
    if (newUserSequence.length === sequence.length) {
      setScore(sequence.length);
      // Wait a bit then add next
      setTimeout(() => {
        addToSequence();
        setUserSequence([]);
      }, 1000);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24}/> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">simon</span>
        </h1>
        <hr className="border-gray-700"/>
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-2xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center gap-2">
                <CirclesFourIcon size={32}/> Simon Says
              </h1>
              <hr className="border-gray-700 mb-8"/>

              <div className="text-center mb-8">
                <div className="text-2xl font-bold mb-2">
                  Score: <span className="text-yellow-400">{score}</span>
                </div>
                {gameOver && (
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-red-500 mb-2">Game Over!</h2>
                    <button
                      onClick={startGame}
                      className="px-6 py-2 rounded-md text-lg font-arvo font-normal border transition-colors duration-300 hover:bg-white/10"
                      style={{borderColor: cardStyle.color, color: cardStyle.color}}
                    >
                      Try Again
                    </button>
                  </div>
                )}
                {!gameActive && !gameOver && (
                  <button
                    onClick={startGame}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal border transition-colors duration-300 hover:bg-white/10"
                    style={{borderColor: cardStyle.color, color: cardStyle.color}}
                  >
                    Start Game
                  </button>
                )}
                {gameActive && (
                  <p className="h-6 text-lg opacity-80">
                    {isPlaying ? 'Watch the sequence...' : 'Your turn!'}
                  </p>
                )}
              </div>

              <div className="simon-grid">
                {colorsList.map((color) => (
                  <div
                    key={color}
                    className={`simon-btn simon-${color} ${activeColor === color ? 'active' : ''} ${(!gameActive || isPlaying) ? 'disabled' : ''}`}
                    onClick={() => handleColorClick(color)}
                  />
                ))}
              </div>

              <p className="text-center mt-8 text-sm opacity-70">
                Repeat the pattern of lights. It gets longer every round!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimonSaysPage;
