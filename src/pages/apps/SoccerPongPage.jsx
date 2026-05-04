import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 9;
const PADDLE_SPEED = 7;
const BALL_SPEED_BASE = 5;
const BALL_SPEED_MAX = 11;
const BALL_SPEED_RAMP = 0.18;

const OBSTACLE_WIDTH = 10;
const OBSTACLE_HEIGHT = 60;
const OBSTACLE_SPEED = 2;

const NOISE_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.10 0 0 0 0 0.23 0 0 0 0 0.32 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const COMMENTARY_STARTERS = [
  'Whistle blown — kick off taken at the centre spot.',
  'The crowd settles. Floodlights tilt to vertical.',
  'Both keepers test the wind. Play resumes.',
];

const COMMENTARY_HOME = [
  'A clinical strike, low and hard past the keeper.',
  'HOME finds the corner — the cream stand erupts.',
  'A deflected effort creeps in. They will all count.',
  'Beautifully worked from the centre line.',
];

const COMMENTARY_AWAY = [
  'AWAY break with pace and bury it.',
  'A cool finish. The travelling support roar.',
  'Clinical. AWAY restore parity.',
  'Tucked into the side netting — no chance.',
];

const COMMENTARY_FINISH = {
  HOME: 'Full time. HOME take the points and the headlines.',
  AWAY: 'Full time. AWAY silence the home faithful.',
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const formatClock = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}`;
};

const HomeCrest = ({ size = 56 }) => (
  <svg viewBox="0 0 60 72" width={size} height={(size * 72) / 60} aria-hidden="true">
    <path
      d="M5 5 L55 5 L55 36 Q55 56 30 68 Q5 56 5 36 Z"
      fill="#d94232"
      stroke="#1a3a52"
      strokeWidth="2.5"
    />
    <path
      d="M14 22 L30 38 L46 22 L30 30 Z"
      fill="#f3e9d2"
      stroke="#1a3a52"
      strokeWidth="1"
    />
    <circle cx="30" cy="52" r="4" fill="#f3e9d2" stroke="#1a3a52" strokeWidth="1" />
    <text
      x="30"
      y="14"
      textAnchor="middle"
      fontSize="6"
      fontFamily="DM Mono, monospace"
      fill="#f3e9d2"
      letterSpacing="2"
    >
      H · F · C
    </text>
  </svg>
);

const AwayCrest = ({ size = 56 }) => (
  <svg viewBox="0 0 60 72" width={size} height={(size * 72) / 60} aria-hidden="true">
    <path
      d="M5 5 L55 5 L55 36 Q55 56 30 68 Q5 56 5 36 Z"
      fill="#1a3a52"
      stroke="#d94232"
      strokeWidth="2.5"
    />
    <rect x="10" y="22" width="40" height="3" fill="#f3e9d2" />
    <rect x="10" y="30" width="40" height="3" fill="#e8a838" />
    <rect x="10" y="38" width="40" height="3" fill="#f3e9d2" />
    <circle cx="30" cy="54" r="3.5" fill="none" stroke="#f3e9d2" strokeWidth="1.5" />
    <text
      x="30"
      y="14"
      textAnchor="middle"
      fontSize="6"
      fontFamily="DM Mono, monospace"
      fill="#f3e9d2"
      letterSpacing="2"
    >
      A · F · C
    </text>
  </svg>
);

const StadiumSilhouette = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 60"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <pattern id="halftone-stadium" width="3" height="3" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="0.6" fill="currentColor" />
      </pattern>
    </defs>
    <path
      d="M0 60 L0 40 L20 40 L25 28 L40 28 L42 18 L70 18 L72 10 L128 10 L130 18 L158 18 L160 28 L175 28 L180 40 L200 40 L200 60 Z"
      fill="url(#halftone-stadium)"
    />
    <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.6" />
    {[8, 22, 36, 50, 64, 78, 92, 108, 122, 136, 150, 164, 178, 192].map((x, i) => (
      <line
        key={i}
        x1={x}
        y1={i % 2 === 0 ? 12 : 14}
        x2={x}
        y2={3}
        stroke="currentColor"
        strokeWidth="0.5"
      />
    ))}
  </svg>
);

const Perforation = () => (
  <svg
    className="absolute right-0 top-2 bottom-2 hidden lg:block"
    width="2"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <pattern
      id="perfs"
      width="2"
      height="14"
      patternUnits="userSpaceOnUse"
    >
      <circle cx="1" cy="3" r="0.9" fill="rgba(26, 58, 82, 0.45)" />
      <circle cx="1" cy="11" r="0.9" fill="rgba(26, 58, 82, 0.45)" />
    </pattern>
    <rect width="2" height="100%" fill="url(#perfs)" />
  </svg>
);

const SoccerPongPage = () => {
  const { addToast } = useContext(ToastContext);
  const canvasRef = useRef(null);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [goalAnimation, setGoalAnimation] = useState({ active: false, scorer: null });
  const [maxScore, setMaxScore] = useState(5);
  const [matchTime, setMatchTime] = useState(0);
  const [commentary, setCommentary] = useState([
    { min: 0, text: 'Programme on sale at the gates. Two pence, sixpence with crest.' },
  ]);

  const ticketNumber = useMemo(
    () => Math.floor(Math.random() * 700 + 200).toString().padStart(3, '0'),
    [],
  );

  const gameState = useRef({
    playerPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT / 2,
    ballDx: BALL_SPEED_BASE,
    ballDy: BALL_SPEED_BASE,
    ballSpeed: BALL_SPEED_BASE,
    rallyHits: 0,
    playerMoveUp: false,
    playerMoveDown: false,
    pointerY: null,
    obstacles: [],
    aiOffset: 0,
  });

  const pushCommentary = useCallback((min, text) => {
    setCommentary((prev) => [{ min, text }, ...prev].slice(0, 12));
  }, []);

  const resetBall = useCallback((servingTo) => {
    const dir = servingTo === 'player' ? -1 : servingTo === 'ai' ? 1 : Math.random() > 0.5 ? 1 : -1;
    gameState.current.ballX = GAME_WIDTH / 2;
    gameState.current.ballY = GAME_HEIGHT / 2;
    gameState.current.ballSpeed = BALL_SPEED_BASE;
    gameState.current.ballDx = dir * BALL_SPEED_BASE;
    gameState.current.ballDy = (Math.random() - 0.5) * BALL_SPEED_BASE * 0.6;
    gameState.current.rallyHits = 0;
    gameState.current.aiOffset = (Math.random() - 0.5) * 30;
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
    setMatchTime(0);
    setCommentary([{ min: 0, text: pickRandom(COMMENTARY_STARTERS) }]);
    resetBall();
    initializeObstacles();
    gameState.current.playerPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    gameState.current.aiPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    setGameStarted(true);
    addToast({ message: 'Kick off — first whistle blown.', type: 'info' });
  }, [resetBall, initializeObstacles, addToast]);

  // Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700;800;900&family=Newsreader:ital,wght@0,400;0,500;1,300;1,400;1,500&family=DM+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Match clock
  useEffect(() => {
    if (!gameStarted || gameOver || goalAnimation.active) return undefined;
    const id = setInterval(() => setMatchTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [gameStarted, gameOver, goalAnimation.active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const drawPitch = () => {
      // Mowing stripes
      const stripeWidth = 50;
      const stripes = Math.ceil(GAME_WIDTH / stripeWidth);
      for (let i = 0; i < stripes; i += 1) {
        ctx.fillStyle = i % 2 === 0 ? '#5a8c44' : '#4a7a3a';
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, GAME_HEIGHT);
      }

      // Subtle vignette
      const vg = ctx.createRadialGradient(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        100,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        500,
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Lines
      ctx.strokeStyle = 'rgba(243, 233, 210, 0.85)';
      ctx.lineWidth = 2;

      // Halfway
      ctx.beginPath();
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.stroke();

      // Centre circle
      ctx.beginPath();
      ctx.arc(GAME_WIDTH / 2, GAME_HEIGHT / 2, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Centre spot
      ctx.fillStyle = 'rgba(243, 233, 210, 0.9)';
      ctx.beginPath();
      ctx.arc(GAME_WIDTH / 2, GAME_HEIGHT / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Penalty boxes (left and right)
      const boxW = 70;
      const boxH = 200;
      ctx.strokeRect(0, GAME_HEIGHT / 2 - boxH / 2, boxW, boxH);
      ctx.strokeRect(GAME_WIDTH - boxW, GAME_HEIGHT / 2 - boxH / 2, boxW, boxH);

      // Six-yard boxes
      const sixW = 28;
      const sixH = 110;
      ctx.strokeRect(0, GAME_HEIGHT / 2 - sixH / 2, sixW, sixH);
      ctx.strokeRect(GAME_WIDTH - sixW, GAME_HEIGHT / 2 - sixH / 2, sixW, sixH);

      // Penalty arcs
      ctx.beginPath();
      ctx.arc(50, GAME_HEIGHT / 2, 40, -Math.PI / 2.5, Math.PI / 2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(GAME_WIDTH - 50, GAME_HEIGHT / 2, 40, Math.PI - Math.PI / 2.5, Math.PI + Math.PI / 2.5);
      ctx.stroke();

      // Corner arcs
      const corner = 12;
      ctx.beginPath();
      ctx.arc(0, 0, corner, 0, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(GAME_WIDTH, 0, corner, Math.PI / 2, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, GAME_HEIGHT, corner, -Math.PI / 2, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(GAME_WIDTH, GAME_HEIGHT, corner, Math.PI, -Math.PI / 2);
      ctx.stroke();

      // Goals (net suggestion) — drawn behind the paddles
      ctx.fillStyle = 'rgba(26, 58, 82, 0.45)';
      ctx.fillRect(0, GAME_HEIGHT / 2 - 60, 4, 120);
      ctx.fillRect(GAME_WIDTH - 4, GAME_HEIGHT / 2 - 60, 4, 120);

      ctx.strokeStyle = 'rgba(243, 233, 210, 0.18)';
      ctx.lineWidth = 1;
      // Net hatching left goal
      for (let y = GAME_HEIGHT / 2 - 60; y < GAME_HEIGHT / 2 + 60; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(8, y + 6);
        ctx.stroke();
      }
      // Net hatching right goal
      for (let y = GAME_HEIGHT / 2 - 60; y < GAME_HEIGHT / 2 + 60; y += 6) {
        ctx.beginPath();
        ctx.moveTo(GAME_WIDTH, y);
        ctx.lineTo(GAME_WIDTH - 8, y + 6);
        ctx.stroke();
      }
    };

    const drawPaddle = (x, y, color, accent) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = accent;
      ctx.fillRect(x, y, PADDLE_WIDTH, 4);
      ctx.fillRect(x, y + PADDLE_HEIGHT - 4, PADDLE_WIDTH, 4);
      // gloss
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(x + 1, y + 6, 2, PADDLE_HEIGHT - 12);
    };

    const drawObstacle = (o) => {
      ctx.fillStyle = 'rgba(232, 168, 56, 0.18)';
      ctx.fillRect(o.x, o.y, o.width, o.height);
      ctx.strokeStyle = 'rgba(232, 168, 56, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(o.x, o.y, o.width, o.height);
      ctx.fillStyle = 'rgba(232, 168, 56, 0.9)';
      ctx.fillRect(o.x, o.y, o.width, 3);
      ctx.fillRect(o.x, o.y + o.height - 3, o.width, 3);
    };

    const drawBall = (x, y) => {
      // White panel base
      ctx.fillStyle = '#f3e9d2';
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Pentagon panels
      ctx.fillStyle = '#1a3a52';
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const px = x + Math.cos(angle) * BALL_RADIUS * 0.45;
        const py = y + Math.sin(angle) * BALL_RADIUS * 0.45;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // outline
      ctx.strokeStyle = '#1a3a52';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // shadow under ball
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(x, y + BALL_RADIUS + 2, BALL_RADIUS * 0.7, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      drawPitch();

      gameState.current.obstacles.forEach(drawObstacle);

      drawPaddle(0, gameState.current.playerPaddleY, '#d94232', '#f3e9d2');
      drawPaddle(GAME_WIDTH - PADDLE_WIDTH, gameState.current.aiPaddleY, '#1a3a52', '#e8a838');

      drawBall(gameState.current.ballX, gameState.current.ballY);
    };

    const update = () => {
      if (gameOver || goalAnimation.active || !gameStarted) return;

      const state = gameState.current;

      // Player movement
      if (state.pointerY != null) {
        const target = state.pointerY - PADDLE_HEIGHT / 2;
        const delta = target - state.playerPaddleY;
        const step = Math.sign(delta) * Math.min(Math.abs(delta), PADDLE_SPEED * 1.4);
        state.playerPaddleY = Math.max(
          0,
          Math.min(GAME_HEIGHT - PADDLE_HEIGHT, state.playerPaddleY + step),
        );
      } else {
        if (state.playerMoveUp) {
          state.playerPaddleY = Math.max(0, state.playerPaddleY - PADDLE_SPEED);
        }
        if (state.playerMoveDown) {
          state.playerPaddleY = Math.min(
            GAME_HEIGHT - PADDLE_HEIGHT,
            state.playerPaddleY + PADDLE_SPEED,
          );
        }
      }

      // AI: aim with imperfection + reaction lag
      const aiTarget = state.ballY + state.aiOffset - PADDLE_HEIGHT / 2;
      const aiSpeed = PADDLE_SPEED * 0.72;
      if (state.aiPaddleY < aiTarget) {
        state.aiPaddleY = Math.min(
          GAME_HEIGHT - PADDLE_HEIGHT,
          state.aiPaddleY + aiSpeed,
        );
      } else if (state.aiPaddleY > aiTarget) {
        state.aiPaddleY = Math.max(0, state.aiPaddleY - aiSpeed);
      }

      // Obstacles
      state.obstacles.forEach((o) => {
        o.y += o.dy;
        if (o.y < 0 || o.y + o.height > GAME_HEIGHT) o.dy *= -1;
      });

      // Ball physics
      state.ballX += state.ballDx;
      state.ballY += state.ballDy;

      if (state.ballY - BALL_RADIUS < 0) {
        state.ballY = BALL_RADIUS;
        state.ballDy *= -1;
      } else if (state.ballY + BALL_RADIUS > GAME_HEIGHT) {
        state.ballY = GAME_HEIGHT - BALL_RADIUS;
        state.ballDy *= -1;
      }

      const reflect = (paddleY, paddleSide) => {
        const relativeIntersect = state.ballY - (paddleY + PADDLE_HEIGHT / 2);
        const normalized = relativeIntersect / (PADDLE_HEIGHT / 2);
        const bounceAngle = normalized * (Math.PI / 3.2); // ±56°
        state.rallyHits += 1;
        state.ballSpeed = Math.min(
          BALL_SPEED_MAX,
          BALL_SPEED_BASE + state.rallyHits * BALL_SPEED_RAMP,
        );
        const dirX = paddleSide === 'left' ? 1 : -1;
        state.ballDx = dirX * state.ballSpeed * Math.cos(bounceAngle);
        state.ballDy = state.ballSpeed * Math.sin(bounceAngle);
        state.aiOffset = (Math.random() - 0.5) * 36;
      };

      // Player paddle
      if (
        state.ballDx < 0 &&
        state.ballX - BALL_RADIUS < PADDLE_WIDTH &&
        state.ballX - BALL_RADIUS > -BALL_RADIUS &&
        state.ballY > state.playerPaddleY &&
        state.ballY < state.playerPaddleY + PADDLE_HEIGHT
      ) {
        state.ballX = PADDLE_WIDTH + BALL_RADIUS;
        reflect(state.playerPaddleY, 'left');
      }

      // AI paddle
      if (
        state.ballDx > 0 &&
        state.ballX + BALL_RADIUS > GAME_WIDTH - PADDLE_WIDTH &&
        state.ballX + BALL_RADIUS < GAME_WIDTH + BALL_RADIUS &&
        state.ballY > state.aiPaddleY &&
        state.ballY < state.aiPaddleY + PADDLE_HEIGHT
      ) {
        state.ballX = GAME_WIDTH - PADDLE_WIDTH - BALL_RADIUS;
        reflect(state.aiPaddleY, 'right');
      }

      // Obstacle collisions (axis-aware)
      state.obstacles.forEach((o) => {
        const within =
          state.ballX + BALL_RADIUS > o.x &&
          state.ballX - BALL_RADIUS < o.x + o.width &&
          state.ballY + BALL_RADIUS > o.y &&
          state.ballY - BALL_RADIUS < o.y + o.height;
        if (!within) return;
        const overlapX = Math.min(
          state.ballX + BALL_RADIUS - o.x,
          o.x + o.width - (state.ballX - BALL_RADIUS),
        );
        const overlapY = Math.min(
          state.ballY + BALL_RADIUS - o.y,
          o.y + o.height - (state.ballY - BALL_RADIUS),
        );
        if (overlapX < overlapY) {
          state.ballDx *= -1;
          state.ballX +=
            state.ballX < o.x + o.width / 2 ? -overlapX : overlapX;
        } else {
          state.ballDy *= -1;
          state.ballY +=
            state.ballY < o.y + o.height / 2 ? -overlapY : overlapY;
        }
      });

      // Scoring
      if (state.ballX < -BALL_RADIUS) handleGoal('AI');
      else if (state.ballX > GAME_WIDTH + BALL_RADIUS) handleGoal('Player');
    };

    const handleGoal = (scorer) => {
      setGoalAnimation({ active: true, scorer });
      const minute = Math.floor(matchTime / 60) + 1;
      pushCommentary(
        minute,
        scorer === 'Player' ? pickRandom(COMMENTARY_HOME) : pickRandom(COMMENTARY_AWAY),
      );
      setTimeout(() => {
        setGoalAnimation({ active: false, scorer: null });
        if (scorer === 'Player') {
          setPlayerScore((s) => {
            if (s + 1 >= maxScore) {
              setGameOver(true);
              setWinner('Player');
              pushCommentary(minute, COMMENTARY_FINISH.HOME);
              return s + 1;
            }
            resetBall('ai');
            return s + 1;
          });
        } else {
          setAiScore((s) => {
            if (s + 1 >= maxScore) {
              setGameOver(true);
              setWinner('AI');
              pushCommentary(minute, COMMENTARY_FINISH.AWAY);
              return s + 1;
            }
            resetBall('player');
            return s + 1;
          });
        }
      }, 1100);
    };

    const gameLoop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (gameStarted && !gameOver) {
      gameLoop();
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    gameStarted,
    gameOver,
    resetBall,
    goalAnimation.active,
    maxScore,
    initializeObstacles,
    matchTime,
    pushCommentary,
  ]);

  // Keyboard
  useEffect(() => {
    const isUp = (k) => k === 'w' || k === 'W' || k === 'ArrowUp';
    const isDown = (k) => k === 's' || k === 'S' || k === 'ArrowDown';
    const handleKeyDown = (e) => {
      if (isUp(e.key)) {
        gameState.current.playerMoveUp = true;
        gameState.current.pointerY = null;
        if (e.key === 'ArrowUp') e.preventDefault();
      }
      if (isDown(e.key)) {
        gameState.current.playerMoveDown = true;
        gameState.current.pointerY = null;
        if (e.key === 'ArrowDown') e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
      if (isUp(e.key)) gameState.current.playerMoveUp = false;
      if (isDown(e.key)) gameState.current.playerMoveDown = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer / touch on canvas
  const onPointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = GAME_HEIGHT / rect.height;
    gameState.current.pointerY = (e.clientY - rect.top) * ratio;
  };
  const onPointerLeave = () => {
    gameState.current.pointerY = null;
  };

  const matchClock = formatClock(matchTime);
  const matchMinute = Math.floor(matchTime / 60) + 1;

  return (
    <div className="matchday-root relative min-h-screen text-[#1a3a52]">
      <Seo
        title="Soccer Pong | Fezcodex"
        description="A pong-style soccer match presented as a 1974 risograph matchday programme. Outscore the AI to take the points."
        keywords={[
          'Fezcodex',
          'soccer pong',
          'pong',
          'soccer',
          'matchday',
          'risograph',
          'programme',
        ]}
      />

      <style>{`
        .matchday-root {
          background:
            radial-gradient(ellipse at 8% 6%, rgba(217, 66, 50, 0.10), transparent 35%),
            radial-gradient(ellipse at 94% 92%, rgba(26, 58, 82, 0.10), transparent 40%),
            #f3e9d2;
          font-family: 'Newsreader', 'Source Serif Pro', Georgia, serif;
        }
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: ${NOISE_DATA_URL};
          background-size: 240px 240px;
          opacity: 0.18;
          mix-blend-mode: multiply;
        }
        .halftone-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(circle, rgba(26, 58, 82, 0.08) 1px, transparent 1.4px);
          background-size: 14px 14px;
          mask-image: radial-gradient(ellipse at center, transparent 30%, black 100%);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 30%, black 100%);
        }

        .display-font {
          font-family: 'Big Shoulders Display', 'Anton', 'Impact', sans-serif;
          font-weight: 800;
          letter-spacing: 0.005em;
        }
        .body-font { font-family: 'Newsreader', 'Source Serif Pro', Georgia, serif; }
        .mono-font {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          letter-spacing: 0.18em;
        }

        .running-header {
          position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.4em;
          color: rgba(26, 58, 82, 0.55);
          text-transform: uppercase;
        }
        .corner-stamp {
          position: fixed; top: 1.25rem; right: 1.5rem;
          z-index: 5;
          padding: 0.4rem 0.7rem;
          border: 1.5px solid rgba(217, 66, 50, 0.6);
          color: #d94232;
          font-family: 'DM Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          transform: rotate(-4deg);
          background: rgba(243, 233, 210, 0.6);
        }
        .folio-mark {
          position: fixed; top: 1.25rem; left: 1.5rem;
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.32em;
          color: rgba(26, 58, 82, 0.55);
          text-transform: uppercase;
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: reveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) backwards; }

        .bar-rule {
          height: 4px;
          background: linear-gradient(to right, #d94232 0%, #d94232 30%, #1a3a52 30%, #1a3a52 70%, #e8a838 70%, #e8a838 100%);
        }
        .ink-rule { height: 1.5px; background: #1a3a52; }

        .ticket-stub {
          position: relative;
          background:
            radial-gradient(circle at top right, transparent 6px, rgba(243, 233, 210, 0.6) 6px),
            #f7eed5;
          border: 1.5px solid rgba(26, 58, 82, 0.85);
          padding: 1.75rem 1.75rem 1.5rem;
        }
        .ticket-stub::before {
          content: '';
          position: absolute; top: -2px; left: 12px; right: 12px;
          height: 4px;
          background: repeating-linear-gradient(90deg, #d94232 0 6px, transparent 6px 12px);
        }

        .kickoff-btn {
          position: relative;
          width: 100%;
          padding: 1.1rem 1.4rem;
          background: #d94232;
          color: #f3e9d2;
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          font-size: 1.4rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: 2px solid #1a3a52;
          box-shadow: 4px 4px 0 #1a3a52;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .kickoff-btn:hover {
          background: #c93222;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #1a3a52;
        }
        .kickoff-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 0 0 0 #1a3a52;
        }
        .kickoff-btn:disabled {
          opacity: 0.45; cursor: not-allowed;
        }

        .abort-btn {
          width: 100%;
          padding: 0.85rem 1rem;
          background: transparent;
          color: rgba(26, 58, 82, 0.7);
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          border: 1.5px solid rgba(26, 58, 82, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .abort-btn:hover {
          background: rgba(26, 58, 82, 0.06);
          color: #1a3a52;
          border-color: #1a3a52;
        }

        .score-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(26, 58, 82, 0.4);
          padding: 0.4rem 0;
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          color: #1a3a52;
          outline: none;
          transition: border-color 0.2s;
        }
        .score-input:focus { border-bottom-color: #d94232; }
        .score-input:disabled { opacity: 0.4; }

        .arena-frame {
          position: relative;
          padding: 18px;
          background:
            linear-gradient(135deg, #1a3a52 0%, #1a3a52 100%);
          box-shadow: 8px 8px 0 rgba(217, 66, 50, 0.85);
        }
        .arena-frame::before {
          content: '';
          position: absolute; inset: 4px;
          border: 1px solid rgba(243, 233, 210, 0.25);
          pointer-events: none;
        }

        .scoreline-digit {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          line-height: 0.85;
          font-size: clamp(4rem, 8vw, 7rem);
          color: #1a3a52;
          letter-spacing: -0.04em;
        }
        .scoreline-digit.home { color: #d94232; }
        .scoreline-divider {
          font-family: 'Big Shoulders Display', sans-serif;
          font-size: clamp(3rem, 6vw, 5rem);
          color: rgba(26, 58, 82, 0.4);
          font-weight: 400;
          line-height: 1;
        }

        .commentary-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.85rem;
          padding: 0.6rem 0;
          border-bottom: 1px dashed rgba(26, 58, 82, 0.2);
        }
        .commentary-row:last-child { border-bottom: 0; }
        .commentary-min {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #d94232;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .commentary-text {
          font-family: 'Newsreader', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: rgba(26, 58, 82, 0.85);
          line-height: 1.4;
        }

        .goal-stamp {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          font-size: clamp(4rem, 12vw, 9rem);
          color: #d94232;
          letter-spacing: 0.02em;
          padding: 0.9rem 2.2rem;
          border: 8px solid #d94232;
          background: rgba(217, 66, 50, 0.08);
          text-shadow: 3px 3px 0 rgba(243, 233, 210, 0.5);
          filter: contrast(1.05);
        }

        .key-cap {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 1.85rem; height: 1.85rem;
          border: 1.5px solid #1a3a52;
          background: #f7eed5;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: #1a3a52;
          box-shadow: 2px 2px 0 rgba(26, 58, 82, 0.6);
        }

        .commentary-scroll {
          max-height: 260px;
          overflow-y: auto;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(26, 58, 82, 0.3) transparent;
        }
        .commentary-scroll::-webkit-scrollbar { width: 5px; }
        .commentary-scroll::-webkit-scrollbar-thumb { background: rgba(26, 58, 82, 0.3); }

        .award-card {
          padding: 1.5rem 1.75rem;
          background: #f7eed5;
          border: 1.5px solid #1a3a52;
          box-shadow: 4px 4px 0 #d94232;
        }

        .canvas-cursor { cursor: ns-resize; }
      `}</style>

      <div className="grain" aria-hidden="true" />
      <div className="halftone-bg" aria-hidden="true" />

      <div className="folio-mark">FOL. III · MATCHDAY № 147</div>
      <div className="running-header">
        ⌁ The Risograph Annual of Athletic Geometries ⌁
      </div>
      <div className="corner-stamp">Imprimatur · MMXXVI</div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:px-12">
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 mb-10 mono-font text-[10px] text-[#1a3a52]/70 hover:text-[#d94232] transition-colors uppercase"
        >
          <ArrowLeftIcon weight="bold" size={11} />
          <span>Return to Apps</span>
        </Link>

        <header className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8 items-end">
            <div className="lg:col-span-7 space-y-5">
              <div
                className="reveal mono-font text-[10px] text-[#d94232]"
                style={{ animationDelay: '0.05s' }}
              >
                Liber IV · Programme Officiel · Volume IV
              </div>
              <h1
                className="display-font reveal leading-[0.78] tracking-tight"
                style={{ animationDelay: '0.15s' }}
              >
                <span className="block text-[clamp(3.5rem,10vw,8.5rem)] text-[#1a3a52]">
                  Soccer
                </span>
                <span
                  className="block text-[clamp(3.5rem,10vw,8.5rem)] text-[#d94232] -mt-3"
                  style={{ fontStyle: 'italic' }}
                >
                  Pong.
                </span>
              </h1>
              <p
                className="reveal body-font italic text-lg md:text-xl text-[#1a3a52]/80 max-w-xl leading-relaxed"
                style={{ animationDelay: '0.3s' }}
              >
                A binary athletics fixture, presented in two-ink offset for the
                discerning supporter. Outscore the visiting computation by{' '}
                <span className="not-italic font-semibold text-[#d94232]">
                  {maxScore}
                </span>{' '}
                clear strikes.
              </p>
              <div
                className="reveal flex items-center gap-3 max-w-md"
                style={{ animationDelay: '0.4s' }}
              >
                <span className="mono-font text-[9px] text-[#1a3a52]/60 whitespace-nowrap">
                  Riso №{maxScore.toString().padStart(2, '0')} / 2 colours
                </span>
                <span className="flex-1 ink-rule" />
              </div>
            </div>

            <div
              className="lg:col-span-5 reveal"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-5 border-y-[3px] border-[#1a3a52]">
                <div className="flex items-center gap-3">
                  <HomeCrest size={62} />
                  <div>
                    <div className="mono-font text-[9px] text-[#1a3a52]/60">HOME</div>
                    <div className="display-font text-2xl text-[#1a3a52]">Hollow F.C.</div>
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="scoreline-digit home">
                    {playerScore.toString().padStart(2, '0')}
                  </span>
                  <span className="scoreline-divider">:</span>
                  <span className="scoreline-digit">
                    {aiScore.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="mono-font text-[9px] text-[#1a3a52]/60">AWAY</div>
                    <div className="display-font text-2xl text-[#1a3a52]">Algorithm A.C.</div>
                  </div>
                  <AwayCrest size={62} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="mono-font text-[10px] text-[#1a3a52]/70">
                  CLOCK <span className="text-[#d94232] font-bold ml-1">{matchClock}</span>
                </div>
                <div className="mono-font text-[10px] text-[#1a3a52]/70">
                  FIRST TO {maxScore.toString().padStart(2, '0')}
                </div>
                <div className="mono-font text-[10px] text-[#1a3a52]/70">
                  MIN <span className="text-[#d94232] font-bold ml-1">{matchMinute.toString().padStart(2, '0')}'</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="reveal mt-10 bar-rule"
            style={{ animationDelay: '0.6s' }}
          />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
          <aside className="lg:col-span-4 space-y-8 relative">
            <Perforation />

            <section
              className="ticket-stub reveal"
              style={{ animationDelay: '0.7s' }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <div className="display-font text-3xl text-[#d94232] leading-none">
                    Admit One.
                  </div>
                  <div className="mono-font text-[9px] text-[#1a3a52]/70 mt-2">
                    Section B · Row XII · Seat 4
                  </div>
                </div>
                <div className="text-right">
                  <div className="mono-font text-[9px] text-[#1a3a52]/70">
                    No.
                  </div>
                  <div className="display-font text-3xl text-[#1a3a52] leading-none">
                    {ticketNumber}
                  </div>
                </div>
              </div>

              <div className="ink-rule mb-5 opacity-50" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="mono-font text-[9px] text-[#1a3a52]/70 block">
                    Target Score
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={maxScore}
                    onChange={(e) =>
                      setMaxScore(
                        Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)),
                      )
                    }
                    disabled={gameStarted && !gameOver}
                    className="score-input"
                  />
                </div>

                {!gameStarted || gameOver ? (
                  <button
                    type="button"
                    onClick={startGame}
                    className="kickoff-btn"
                  >
                    <span>{gameOver ? 'Replay Fixture' : 'Kick Off'}</span>
                    <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>⚽</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setGameOver(true);
                      setWinner(null);
                    }}
                    className="abort-btn"
                  >
                    Abandon Match
                  </button>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="mono-font text-[8px] text-[#1a3a52]/60">
                    Kick Off · 15:00
                  </span>
                  <span className="mono-font text-[8px] text-[#1a3a52]/60">
                    Two pence, sixpence with crest
                  </span>
                </div>
              </div>
            </section>

            <section
              className="reveal space-y-3"
              style={{ animationDelay: '0.8s' }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="display-font text-xl text-[#1a3a52]">Touchline Controls</h3>
                <span className="mono-font text-[9px] text-[#1a3a52]/60">§ Manus</span>
              </div>
              <div className="ink-rule opacity-50" />
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="key-cap">W</span>
                    <span className="key-cap">↑</span>
                  </div>
                  <span className="mono-font text-[10px] text-[#1a3a52]/80">Defend High</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="key-cap">S</span>
                    <span className="key-cap">↓</span>
                  </div>
                  <span className="mono-font text-[10px] text-[#1a3a52]/80">Defend Low</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#1a3a52]/20">
                  <span className="mono-font text-[10px] text-[#1a3a52]/80">Or drag pointer over the pitch</span>
                </div>
              </div>
            </section>

            <section
              className="reveal space-y-3"
              style={{ animationDelay: '0.9s' }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="display-font text-xl text-[#1a3a52]">Match Notes</h3>
                <span className="mono-font text-[9px] text-[#1a3a52]/60">§ Acta</span>
              </div>
              <div className="ink-rule opacity-50" />
              <div className="commentary-scroll">
                {commentary.length === 0 ? (
                  <div className="commentary-text py-2">
                    Awaiting first whistle.
                  </div>
                ) : (
                  commentary.map((c, i) => (
                    <div key={i} className="commentary-row">
                      <span className="commentary-min">{c.min.toString().padStart(2, '0')}'</span>
                      <span className="commentary-text">{c.text}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>

          <section className="lg:col-span-8 space-y-8">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <span className="mono-font text-[9px] text-[#1a3a52]/70">FIXTURE</span>
                <span
                  className="display-font text-2xl text-[#1a3a52]"
                  style={{ fontStyle: 'italic' }}
                >
                  Hollow F.C. v Algorithm A.C.
                </span>
              </div>
              <StadiumSilhouette className="w-32 h-10 text-[#1a3a52]/55" />
            </div>

            <div
              className="arena-frame reveal"
              style={{ animationDelay: '0.7s' }}
            >
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={GAME_WIDTH}
                  height={GAME_HEIGHT}
                  onPointerMove={onPointerMove}
                  onPointerLeave={onPointerLeave}
                  className="block w-full h-auto canvas-cursor"
                  style={{
                    aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
                    touchAction: 'none',
                  }}
                />

                <AnimatePresence>
                  {!gameStarted && !gameOver && (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center z-20"
                      style={{ background: 'rgba(26, 58, 82, 0.84)' }}
                    >
                      <div className="text-center space-y-5 px-6">
                        <div className="mono-font text-[10px] text-[#e8a838] tracking-[0.5em]">
                          ⌁ AWAITING KICK OFF ⌁
                        </div>
                        <div
                          className="display-font text-5xl md:text-6xl text-[#f3e9d2] leading-none"
                          style={{ fontStyle: 'italic' }}
                        >
                          The pitch is dressed.
                        </div>
                        <div className="body-font italic text-base text-[#f3e9d2]/80 max-w-md mx-auto">
                          Step onto the touchline. Press <span className="not-italic font-semibold text-[#e8a838]">Kick Off</span> to begin the fixture.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {goalAnimation.active && (
                    <motion.div
                      key="goal"
                      initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                      animate={{ scale: 1, rotate: -7, opacity: 1 }}
                      exit={{ scale: 1.5, rotate: -3, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        damping: 9,
                        stiffness: 220,
                      }}
                      className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                    >
                      <span className="goal-stamp">GOAL!</span>
                    </motion.div>
                  )}

                  {gameOver && (
                    <motion.div
                      key="end"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center z-40 p-6"
                      style={{ background: 'rgba(26, 58, 82, 0.92)' }}
                    >
                      <div className="award-card max-w-md w-full text-center space-y-5">
                        <div className="mono-font text-[10px] text-[#d94232] tracking-[0.4em]">
                          ⌁ FULL TIME ⌁
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          {winner === 'Player' ? (
                            <HomeCrest size={70} />
                          ) : (
                            <AwayCrest size={70} />
                          )}
                          <div className="text-left">
                            <div className="mono-font text-[9px] text-[#1a3a52]/70">
                              Match Honours to
                            </div>
                            <div
                              className="display-font text-3xl text-[#1a3a52] leading-none"
                              style={{ fontStyle: 'italic' }}
                            >
                              {winner === 'Player' ? 'Hollow F.C.' : 'Algorithm A.C.'}
                            </div>
                          </div>
                        </div>
                        <div className="ink-rule opacity-50" />
                        <div className="flex items-center justify-around">
                          <div>
                            <div className="mono-font text-[9px] text-[#1a3a52]/60">HOME</div>
                            <div className="scoreline-digit home" style={{ fontSize: '3rem' }}>
                              {playerScore}
                            </div>
                          </div>
                          <span className="scoreline-divider" style={{ fontSize: '2.5rem' }}>:</span>
                          <div>
                            <div className="mono-font text-[9px] text-[#1a3a52]/60">AWAY</div>
                            <div className="scoreline-digit" style={{ fontSize: '3rem' }}>
                              {aiScore}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={startGame}
                          className="kickoff-btn"
                          style={{ fontSize: '1rem', padding: '0.85rem 1.2rem' }}
                        >
                          <span>Re-fixture</span>
                          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>↻</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2">
              <div>
                <div className="mono-font text-[9px] text-[#1a3a52]/60 mb-1">RALLY</div>
                <div className="display-font text-3xl text-[#1a3a52]">
                  {gameState.current.rallyHits.toString().padStart(2, '0')}
                </div>
              </div>
              <div>
                <div className="mono-font text-[9px] text-[#1a3a52]/60 mb-1">VENUE</div>
                <div className="display-font text-3xl text-[#1a3a52]">
                  Terminal XXIII
                </div>
              </div>
              <div className="text-right">
                <div className="mono-font text-[9px] text-[#1a3a52]/60 mb-1">EDITION</div>
                <div className="display-font text-3xl text-[#d94232]">
                  Riso · 1974
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-24 pt-8 border-t-[3px] border-[#1a3a52] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="mono-font text-[9px] text-[#1a3a52]/70">
            ⌁ Printed in two-ink halftone · Lordran-on-Sea · MMXXVI ⌁
          </div>
          <div className="flex items-center gap-4">
            <span className="bar-rule w-20 inline-block" />
            <span className="mono-font text-[9px] text-[#1a3a52]/70">
              Programme priced two pence
            </span>
          </div>
        </footer>
      </div>

    </div>
  );
};

export default SoccerPongPage;
