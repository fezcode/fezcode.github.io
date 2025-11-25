import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, BugIcon, GavelIcon} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import '../../styles/WhackABugPage.css';

const HOLE_COUNT = 9;
const GAME_DURATION = 30;
const INITIAL_SPEED = 800;

const WhackABugPage = () => {
  useSeo({
    title: 'Whack-a-Bug | Fezcodex',
    description: 'Test your reflexes by fixing bugs as fast as you can!',
    keywords: ['Fezcodex', 'whack a bug', 'game', 'reflexes', 'fun'],
    ogTitle: 'Whack-a-Bug | Fezcodex',
    ogDescription: 'Test your reflexes by fixing bugs as fast as you can!',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Whack-a-Bug | Fezcodex',
    twitterDescription: 'Test your reflexes by fixing bugs as fast as you can!',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeHole, setActiveHole] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [lastHole, setLastHole] = useState(null);
  const timerRef = useRef(null);
  const bugTimerRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    setActiveHole(null);
    setLastHole(null);    // Start game timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start bug movement
    moveBug();
  };

  const endGame = () => {
    setGameActive(false);
    clearInterval(timerRef.current);
    clearTimeout(bugTimerRef.current);
    setActiveHole(null);
  };

  const moveBug = () => {
    if (!gameActive && timeLeft === GAME_DURATION && score === 0) {
      // Initial move called from startGame
    } else if (!gameActive) {
      return;
    }

    const randomTime = random(500, 1000);
    const holeIndex = randomHole(lastHole);

    setActiveHole(holeIndex);
    setLastHole(holeIndex);

    bugTimerRef.current = setTimeout(() => {
      if (gameActive) {
        moveBug();
      }
    }, randomTime);
  };

  // Need a separate effect to keep the bug moving loop correctly responsive to gameActive state change if handled inside moveBug,
  // but refs are better for intervals.
  // Actually, simpler approach:
  useEffect(() => {
    if (gameActive) {
      const jump = () => {
        const time = random(600, 1000);
        const idx = Math.floor(Math.random() * HOLE_COUNT);
        let newHole = idx;
        if (newHole === lastHole) {
          newHole = (newHole + 1) % HOLE_COUNT;
        }
        setActiveHole(newHole);
        setLastHole(newHole);
        bugTimerRef.current = setTimeout(jump, time);
      };
      jump();
    }
    return () => clearTimeout(bugTimerRef.current);
  }, [gameActive]);

  const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const randomHole = (previous) => {
    const idx = Math.floor(Math.random() * HOLE_COUNT);
    if (idx === previous) {
      return (idx + 1) % HOLE_COUNT;
    }
    return idx;
  };

  const handleWhack = (index) => {
    if (!gameActive) return;
    if (index === activeHole) {
      setScore((prev) => prev + 1);
      setActiveHole(null); // Hide immediately
      // Optional: Trigger immediate move?
      // For now let the timer handle it, or it might be too easy.
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(bugTimerRef.current);
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
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center justify-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">wab</span>
        </h1>
        <hr className="border-gray-700"/>
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
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
                <GavelIcon size={32}/> Whack-a-Bug
              </h1>
              <hr className="border-gray-700 mb-4"/>

              <div className="flex justify-between items-center mb-8 text-xl font-bold">
                <div>Score: <span className="text-green-400">{score}</span></div>
                <div>Time: <span className={`${timeLeft <= 5 ? 'text-red-500' : ''}`}>{timeLeft}s</span></div>
              </div>

              {!gameActive && timeLeft === 0 ? (
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
                  <p className="text-xl mb-4">Final Score: {score}</p>
                  <button
                    onClick={startGame}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal border transition-colors duration-300 hover:bg-white/10"
                    style={{borderColor: cardStyle.color, color: cardStyle.color}}
                  >
                    Play Again
                  </button>
                </div>
              ) : !gameActive ? (
                <div className="text-center mb-8">
                  <button
                    onClick={startGame}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal border transition-colors duration-300 hover:bg-white/10"
                    style={{borderColor: cardStyle.color, color: cardStyle.color}}
                  >
                    Start Game
                  </button>
                </div>
              ) : null}

              <div className="whack-a-bug-grid">
                {Array.from({length: HOLE_COUNT}).map((_, index) => (
                  <div
                    key={index}
                    className="bug-hole flex items-center justify-center"
                    onClick={() => handleWhack(index)}
                  >
                    {activeHole === index && (
                      <div className="bug text-red-400">
                        <BugIcon size={48} weight="fill"/>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center mt-8 text-sm opacity-70">
                Click the bugs as they appear! Don't let them escape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhackABugPage;
