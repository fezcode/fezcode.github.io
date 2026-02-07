import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  SoccerBallIcon,
  PlayIcon,
  ArrowsClockwiseIcon,
  TrophyIcon,
  ChartBarIcon,
  GearSixIcon,
  EyeIcon,
  KeyboardIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// Obstacle Constants
const OBSTACLE_WIDTH = 10;
const OBSTACLE_HEIGHT = 60;
const OBSTACLE_SPEED = 2;

const SoccerPongPage = () => {
  const appName = 'Soccer Pong';

  const { addToast } = useContext(ToastContext);
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [goalAnimation, setGoalAnimation] = useState({
    active: false,
    scorer: null,
  });
  const [maxScore, setMaxScore] = useState(5);

  const gameState = useRef({
    playerPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT / 2,
    ballDx: BALL_SPEED,
    ballDy: BALL_SPEED,
    playerMoveUp: false,
    playerMoveDown: false,
    obstacles: [],
  });

  const resetBall = useCallback(() => {
    gameState.current.ballX = GAME_WIDTH / 2;
    gameState.current.ballY = GAME_HEIGHT / 2;
    gameState.current.ballDx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    gameState.current.ballDy =
      (Math.random() > 0.5 ? 1 : -1) * (BALL_SPEED * 0.8);
  }, []);

  const initializeObstacles = useCallback(() => {
    gameState.current.obstacles = [
      {
        x: GAME_WIDTH / 4 - OBSTACLE_WIDTH / 2,
        y: GAME_HEIGHT / 4,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        dy: OBSTACLE_SPEED,
      },
      {
        x: GAME_WIDTH / 4 - OBSTACLE_WIDTH / 2,
        y: (GAME_HEIGHT * 3) / 4 - OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        dy: -OBSTACLE_SPEED,
      },
      {
        x: (GAME_WIDTH * 3) / 4 - OBSTACLE_WIDTH / 2,
        y: GAME_HEIGHT / 4,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        dy: -OBSTACLE_SPEED,
      },
      {
        x: (GAME_WIDTH * 3) / 4 - OBSTACLE_WIDTH / 2,
        y: (GAME_HEIGHT * 3) / 4 - OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        dy: OBSTACLE_SPEED,
      },
    ];
  }, []);

  const startGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setWinner(null);
    setGoalAnimation({ active: false, scorer: null });
    resetBall();
    initializeObstacles();
    gameState.current.playerPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    gameState.current.aiPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    setGameStarted(true);
    addToast({ message: 'GAME_INITIALIZED: Simulation active.', type: 'info' });
  }, [resetBall, initializeObstacles, addToast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Pitch lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center circle
      ctx.beginPath();
      ctx.arc(GAME_WIDTH / 2, GAME_HEIGHT / 2, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Player paddle
      ctx.fillStyle = '#10b981';
      ctx.fillRect(
        0,
        gameState.current.playerPaddleY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
      );

      // AI paddle
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        GAME_WIDTH - PADDLE_WIDTH,
        gameState.current.aiPaddleY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
      );

      // Obstacles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      gameState.current.obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Ball
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(
        gameState.current.ballX,
        gameState.current.ballY,
        BALL_SIZE / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const update = () => {
      if (gameOver || goalAnimation.active || !gameStarted) return;

      const state = gameState.current;

      // Movement
      if (state.playerMoveUp)
        state.playerPaddleY = Math.max(0, state.playerPaddleY - PADDLE_SPEED);
      if (state.playerMoveDown)
        state.playerPaddleY = Math.min(
          GAME_HEIGHT - PADDLE_HEIGHT,
          state.playerPaddleY + PADDLE_SPEED,
        );

      // AI Logic
      const aiTarget = state.ballY - PADDLE_HEIGHT / 2;
      if (state.aiPaddleY < aiTarget)
        state.aiPaddleY = Math.min(
          GAME_HEIGHT - PADDLE_HEIGHT,
          state.aiPaddleY + PADDLE_SPEED * 0.7,
        );
      else if (state.aiPaddleY > aiTarget)
        state.aiPaddleY = Math.max(0, state.aiPaddleY - PADDLE_SPEED * 0.7);

      // Obstacles
      state.obstacles.forEach((o) => {
        o.y += o.dy;
        if (o.y < 0 || o.y + o.height > GAME_HEIGHT) o.dy *= -1;
      });

      // Ball Physics
      state.ballX += state.ballDx;
      state.ballY += state.ballDy;

      if (
        state.ballY - BALL_SIZE / 2 < 0 ||
        state.ballY + BALL_SIZE / 2 > GAME_HEIGHT
      )
        state.ballDy *= -1;

      // Paddle Collisions
      if (
        state.ballX - BALL_SIZE / 2 < PADDLE_WIDTH &&
        state.ballY > state.playerPaddleY &&
        state.ballY < state.playerPaddleY + PADDLE_HEIGHT
      ) {
        state.ballDx = Math.abs(state.ballDx);
        state.ballDy += (Math.random() - 0.5) * 4;
      }
      if (
        state.ballX + BALL_SIZE / 2 > GAME_WIDTH - PADDLE_WIDTH &&
        state.ballY > state.aiPaddleY &&
        state.ballY < state.aiPaddleY + PADDLE_HEIGHT
      ) {
        state.ballDx = -Math.abs(state.ballDx);
        state.ballDy += (Math.random() - 0.5) * 4;
      }

      // Obstacle Collisions
      state.obstacles.forEach((o) => {
        if (
          state.ballX + BALL_SIZE / 2 > o.x &&
          state.ballX - BALL_SIZE / 2 < o.x + o.width &&
          state.ballY + BALL_SIZE / 2 > o.y &&
          state.ballY - BALL_SIZE / 2 < o.y + o.height
        ) {
          state.ballDx *= -1;
          state.ballDy += (Math.random() - 0.5) * 2;
        }
      });

      // Scoring
      if (state.ballX < 0) handleGoal('AI');
      else if (state.ballX > GAME_WIDTH) handleGoal('Player');
    };

    const handleGoal = (scorer) => {
      setGoalAnimation({ active: true, scorer });
      setTimeout(() => {
        setGoalAnimation({ active: false, scorer: null });
        if (scorer === 'Player') {
          setPlayerScore((s) => {
            if (s + 1 >= maxScore) {
              setGameOver(true);
              setWinner('Player');
              return s + 1;
            }
            resetBall();
            return s + 1;
          });
        } else {
          setAiScore((s) => {
            if (s + 1 >= maxScore) {
              setGameOver(true);
              setWinner('AI');
              return s + 1;
            }
            resetBall();
            return s + 1;
          });
        }
      }, 1000);
    };

    const gameLoop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (gameStarted && !gameOver) {
      gameLoop();
    } else {
      draw(); // Initial draw
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    gameStarted,
    gameOver,
    resetBall,
    goalAnimation.active,
    maxScore,
    initializeObstacles,
  ]);

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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Soccer Pong | Fezcodex"
        description="A Pong-style game with a soccer twist. High-performance brutalist interface."
        keywords={[
          'Fezcodex',
          'soccer pong',
          'arcade game',
          'pong',
          'soccer',
          'AI game',
          'brutalist',
        ]}
      />
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
          <BreadcrumbTitle title={appName} slug="sp" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Binary athletics simulation. Outperform the AI sub-routine in a{' '}
                <span className="text-emerald-400 font-bold">
                  high-frequency
                </span>{' '}
                kinematic match.
              </p>
            </div>

            <div className="flex gap-12 font-mono text-center md:text-left">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Player_Score
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  {playerScore.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  AI_Subroutine
                </span>
                <span className="text-3xl font-black text-white">
                  {aiScore.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <GearSixIcon weight="fill" />
                Match_Configuration
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Score_to_Terminate
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxScore}
                    onChange={(e) =>
                      setMaxScore(Math.max(1, parseInt(e.target.value)))
                    }
                    disabled={gameStarted && !gameOver}
                    className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase disabled:opacity-30"
                  />
                </div>

                {!gameStarted || gameOver ? (
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs flex items-center justify-center gap-3"
                  >
                    <PlayIcon weight="bold" size={18} />
                    {gameOver ? 'REBOOT_MATCH' : 'INIT_SIMULATION'}
                  </button>
                ) : (
                  <button
                    onClick={() => setGameOver(true)}
                    className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <ArrowsClockwiseIcon weight="bold" size={16} />
                    ABORT_MATCH
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <KeyboardIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Control_Mapping
                </h4>
              </div>
              <div className="space-y-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Input_W</span>
                  <span className="text-white">PADDLE_UP</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Input_S</span>
                  <span className="text-white">PADDLE_DOWN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arena Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500" />
              Kinematic_Arena_Preview
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[450px]">
              <div className="relative border-4 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                <canvas
                  ref={canvasRef}
                  width={GAME_WIDTH}
                  height={GAME_HEIGHT}
                  className="max-w-full h-auto block"
                />

                <AnimatePresence>
                  {!gameStarted && !gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                      <div className="text-center space-y-6">
                        <SoccerBallIcon
                          size={64}
                          weight="thin"
                          className="mx-auto text-emerald-500/50 animate-pulse"
                        />
                        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.4em]">
                          AWAITING_USER_START_SIGNAL
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {goalAnimation.active && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                    >
                      <span
                        className={`text-8xl font-black font-mono uppercase tracking-tighter ${goalAnimation.scorer === 'Player' ? 'text-emerald-500' : 'text-white'}`}
                      >
                        GOAL!
                      </span>
                    </motion.div>
                  )}

                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-40 p-8"
                    >
                      <div className="text-center space-y-8">
                        <TrophyIcon
                          size={80}
                          weight="fill"
                          className={
                            winner === 'Player'
                              ? 'mx-auto text-emerald-500'
                              : 'mx-auto text-white/20'
                          }
                        />
                        <div className="space-y-2">
                          <h2 className="text-5xl font-black font-mono uppercase tracking-tighter">
                            {winner === 'Player'
                              ? 'VICTORY_SECURED'
                              : 'SYSTEM_OVERRIDE'}
                          </h2>
                          <p className="font-mono text-sm text-gray-500 uppercase tracking-widest">
                            FINAL_SCORE: {playerScore} :: {aiScore}
                          </p>
                        </div>
                        <button
                          onClick={startGame}
                          className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                        >
                          RE_INITIALIZE
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full mt-8 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-[0.5em] text-gray-500 px-4">
                <span className="flex items-center gap-2">
                  <ChartBarIcon /> LIVE_TELEMETRY_FEED
                </span>
                <span>SP_v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoccerPongPage;
