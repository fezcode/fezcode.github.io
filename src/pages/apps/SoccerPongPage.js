import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SoccerBallIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import '../../styles/SoccerPongPage.css';

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_SPEED = 5;
const BALL_SPEED = 4;

// Obstacle Constants
const OBSTACLE_WIDTH = 10;
const OBSTACLE_HEIGHT = 60;
const OBSTACLE_SPEED = 2;

const SoccerPongPage = () => {
  useSeo({
    title: 'Soccer Pong | Fezcodex',
    description: 'A Pong-style game with a soccer twist. Player vs. AI.',
    keywords: ['Fezcodex', 'soccer pong', 'arcade game', 'pong', 'soccer', 'AI game'],
    ogTitle: 'Soccer Pong | Fezcodex',
    ogDescription: 'A Pong-style game with a soccer twist. Player vs. AI.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Soccer Pong | Fezcodex',
    twitterDescription: 'A Pong-style game with a soccer twist. Player vs. AI.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [goalAnimation, setGoalAnimation] = useState({ active: false, scorer: null });
  const [maxScore, setMaxScore] = useState(5); // New state for configurable max score

  // Game state (mutable for game loop)
  const gameState = useRef({
    playerPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT / 2,
    ballDx: BALL_SPEED,
    ballDy: BALL_SPEED,
    playerMoveUp: false,
    playerMoveDown: false,
    obstacles: [], // Array to hold obstacle data
  });

  const resetBall = useCallback(() => {
    gameState.current.ballX = GAME_WIDTH / 2;
    gameState.current.ballY = GAME_HEIGHT / 2;
    gameState.current.ballDx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    gameState.current.ballDy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
  }, []);

  const initializeObstacles = useCallback(() => {
    gameState.current.obstacles = [
      // Left half obstacles
      { x: GAME_WIDTH / 4 - OBSTACLE_WIDTH / 2, y: GAME_HEIGHT / 4, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT, dy: OBSTACLE_SPEED },
      { x: GAME_WIDTH / 4 - OBSTACLE_WIDTH / 2, y: GAME_HEIGHT * 3 / 4 - OBSTACLE_HEIGHT, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT, dy: -OBSTACLE_SPEED },
      // Right half obstacles
      { x: GAME_WIDTH * 3 / 4 - OBSTACLE_WIDTH / 2, y: GAME_HEIGHT / 4, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT, dy: -OBSTACLE_SPEED },
      { x: GAME_WIDTH * 3 / 4 - OBSTACLE_WIDTH / 2, y: GAME_HEIGHT * 3 / 4 - OBSTACLE_HEIGHT, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT, dy: OBSTACLE_SPEED },
    ];
  }, []);

  const startGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setWinner(null);
    setGoalAnimation({ active: false, scorer: null });
    resetBall();
    initializeObstacles(); // Initialize obstacles when starting game
    gameState.current.playerPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    gameState.current.aiPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    setGameStarted(true);
  }, [resetBall, initializeObstacles]);

  // No useEffect for auto-start, game starts only with button press

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw field lines (optional, for soccer feel)
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.stroke();

      // Draw player paddle
      ctx.fillStyle = '#FF4500'; // OrangeRed
      ctx.fillRect(0, gameState.current.playerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw AI paddle
      ctx.fillStyle = '#4B0082'; // Indigo
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, gameState.current.aiPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw obstacles
      ctx.fillStyle = '#808080'; // Gray color for obstacles
      gameState.current.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Draw ball
      ctx.fillStyle = '#FFFFFF'; // White
      ctx.beginPath();
      ctx.arc(gameState.current.ballX, gameState.current.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const update = () => {
      if (gameOver || goalAnimation.active || !gameStarted) return; // Pause game during goal animation or if not started

      // Player paddle movement
      if (gameState.current.playerMoveUp) {
        gameState.current.playerPaddleY = Math.max(0, gameState.current.playerPaddleY - PADDLE_SPEED);
      }
      if (gameState.current.playerMoveDown) {
        gameState.current.playerPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.current.playerPaddleY + PADDLE_SPEED);
      }

      // AI paddle movement (simple AI)
      if (gameState.current.ballY < gameState.current.aiPaddleY + PADDLE_HEIGHT / 2) {
        gameState.current.aiPaddleY = Math.max(0, gameState.current.aiPaddleY - PADDLE_SPEED * 0.8); // AI is a bit slower
      } else if (gameState.current.ballY > gameState.current.aiPaddleY + PADDLE_HEIGHT / 2) {
        gameState.current.aiPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.current.aiPaddleY + PADDLE_SPEED * 0.8);
      }

      // Obstacle movement
      gameState.current.obstacles.forEach(obstacle => {
        obstacle.y += obstacle.dy;
        // Reverse direction if hitting top or bottom
        if (obstacle.y < 0 || obstacle.y + obstacle.height > GAME_HEIGHT) {
          obstacle.dy *= -1;
        }
      });

      // Ball movement
      gameState.current.ballX += gameState.current.ballDx;
      gameState.current.ballY += gameState.current.ballDy;

      // Ball collision with top/bottom walls
      if (gameState.current.ballY - BALL_SIZE / 2 < 0 || gameState.current.ballY + BALL_SIZE / 2 > GAME_HEIGHT) {
        gameState.current.ballDy *= -1;
      }

      // Ball collision with player paddle
      if (
        gameState.current.ballX - BALL_SIZE / 2 < PADDLE_WIDTH &&
        gameState.current.ballY + BALL_SIZE / 2 > gameState.current.playerPaddleY &&
        gameState.current.ballY - BALL_SIZE / 2 < gameState.current.playerPaddleY + PADDLE_HEIGHT
      ) {
        gameState.current.ballDx *= -1;
        // Add a slight random angle change for more dynamic play
        gameState.current.ballDy += (Math.random() - 0.5) * 2;
      }

      // Ball collision with AI paddle
      if (
        gameState.current.ballX + BALL_SIZE / 2 > GAME_WIDTH - PADDLE_WIDTH &&
        gameState.current.ballY + BALL_SIZE / 2 > gameState.current.aiPaddleY &&
        gameState.current.ballY - BALL_SIZE / 2 < gameState.current.aiPaddleY + PADDLE_HEIGHT
      ) {
        gameState.current.ballDx *= -1;
        // Add a slight random angle change
        gameState.current.ballDy += (Math.random() - 0.5) * 2;
      }

      // Ball collision with obstacles
      gameState.current.obstacles.forEach(obstacle => {
        if (
          gameState.current.ballX + BALL_SIZE / 2 > obstacle.x &&
          gameState.current.ballX - BALL_SIZE / 2 < obstacle.x + obstacle.width &&
          gameState.current.ballY + BALL_SIZE / 2 > obstacle.y &&
          gameState.current.ballY - BALL_SIZE / 2 < obstacle.y + obstacle.height
        ) {
          // Collision detected, reverse ball direction
          // Determine if collision is horizontal or vertical for more realistic bounce
          const overlapX = Math.min(gameState.current.ballX + BALL_SIZE / 2, obstacle.x + obstacle.width) - Math.max(gameState.current.ballX - BALL_SIZE / 2, obstacle.x);
          const overlapY = Math.min(gameState.current.ballY + BALL_SIZE / 2, obstacle.y + obstacle.height) - Math.max(gameState.current.ballY - BALL_SIZE / 2, obstacle.y);

          if (overlapX < overlapY) { // Horizontal collision
            gameState.current.ballDx *= -1;
          } else { // Vertical collision
            gameState.current.ballDy *= -1;
          }
          // Add a slight random angle change
          gameState.current.ballDy += (Math.random() - 0.5) * 2;
        }
      });

      // Scoring
      if (gameState.current.ballX - BALL_SIZE / 2 < 0) { // AI scores
        setGoalAnimation({ active: true, scorer: 'AI' });
        setTimeout(() => {
          setGoalAnimation({ active: false, scorer: null });
          setAiScore(prev => {
            const newScore = prev + 1;
            if (newScore >= maxScore) { // Use maxScore here
              setGameOver(true);
              setWinner('AI');
            } else {
              resetBall();
            }
            return newScore;
          });
        }, 1000); // Animation duration
      } else if (gameState.current.ballX + BALL_SIZE / 2 > GAME_WIDTH) { // Player scores
        setGoalAnimation({ active: true, scorer: 'Player' });
        setTimeout(() => {
          setGoalAnimation({ active: false, scorer: null });
          setPlayerScore(prev => {
            const newScore = prev + 1;
            if (newScore >= maxScore) { // Use maxScore here
              setGameOver(true);
              setWinner('Player');
            } else {
              resetBall();
            }
            return newScore;
          });
        }, 1000); // Animation duration
      }
    };

    const gameLoop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (gameStarted && !gameOver) {
      gameLoop();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, resetBall, goalAnimation.active, maxScore, initializeObstacles]); // Add initializeObstacles to dependencies

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'w') gameState.current.playerMoveUp = true;
      if (e.key.toLowerCase() === 's') gameState.current.playerMoveDown = true;
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === 'w') gameState.current.playerMoveUp = false;
      if (e.key.toLowerCase() === 's') gameState.current.playerMoveDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">soccer-pong</span>
        </h1>
        <hr className="border-gray-700" />
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
                <SoccerBallIcon size={32} /> Soccer Pong
              </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="game-area">
                <div className="score-board mb-4 text-xl font-bold">
                  Player: {playerScore} - AI: {aiScore}
                </div>
                <div className="flex justify-center items-center gap-4 mb-2">
                  <div className="controls-display text-sm">
                    W: Up, S: Down
                  </div>
                  <div className="max-score-config text-sm">
                    Score to Win:
                    <input
                      type="number"
                      min="1"
                      value={maxScore}
                      onChange={(e) => setMaxScore(Math.max(1, parseInt(e.target.value)))}
                      className="ml-2 w-16 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                      disabled={gameStarted} // Disable input when game has started
                    />
                  </div>
                </div>
                {goalAnimation.active && (
                  <div className={`goal-animation ${goalAnimation.scorer === 'Player' ? 'player-goal' : 'ai-goal'}`}>
                    GOAL!
                  </div>
                )}
                {gameOver && (
                  <div className="game-over-message text-center text-3xl font-bold mb-4">
                    {winner === 'Player' ? 'You Win!' : 'AI Wins!'}
                    <button
                      onClick={startGame}
                      className="block mx-auto mt-4 px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        color: cardStyle.color,
                        borderColor: cardStyle.borderColor,
                        border: '1px solid',
                      }}
                    >
                      Play Again
                    </button>
                  </div>
                )}
                {!gameStarted && (
                  <div className="start-game-message text-center text-3xl font-bold mb-4">
                    Click "Play Game" to Play!
                    <button
                      onClick={startGame}
                      className="block mx-auto mt-4 px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        color: cardStyle.color,
                        borderColor: cardStyle.borderColor,
                        border: '1px solid',
                      }}
                    >
                      Play Game
                    </button>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={GAME_WIDTH}
                  height={GAME_HEIGHT}
                  className="border border-gray-600 bg-gray-900"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoccerPongPage;
