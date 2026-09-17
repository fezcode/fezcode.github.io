import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only. No shared chrome.
// Aesthetic: a squared exercise book. The grid is printed, the moves are
// written — ✕ in pencil, ○ in blue ballpoint, as if two people share the desk.
// A win is struck through, which is how the game actually ends on paper.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Archivo:wght@400;500;600&display=swap');

.ttt {
  --desk:       #24211c;
  --desk-2:     #191713;
  --paper:      #e8eae2;
  --paper-warm: #eef0e8;
  --paper-edge: #cdd2c3;
  --grid:       #b9c5d6;
  --margin:     #cc6a5d;
  --graphite:   #343a40;
  --graphite-2: #5d656d;
  --graphite-3: #8b939b;
  --biro:       #2f4f9e;

  font-family: 'Archivo', system-ui, sans-serif;
  color: var(--graphite);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  /* the desk the sheet is lying on */
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,240,210,0.07), transparent 70%),
    var(--desk);
  padding: 44px 20px 80px;
}

.ttt__shell {
  position: relative; z-index: 1;
  max-width: 760px;
  margin: 0 auto;
}

/* — the sheet itself — */
.ttt__sheet {
  position: relative;
  background: var(--paper);
  padding: 44px 44px 40px 78px;
  transform: rotate(-0.35deg);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.28) inset,
    0 18px 40px -12px rgba(0,0,0,0.6),
    0 2px 6px rgba(0,0,0,0.35);
}
@media (max-width: 720px) {
  .ttt__sheet { padding: 30px 20px 30px 42px; transform: none; }
}
/* printed grid, clipped to the sheet */
.ttt__sheet::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 23px 23px;
  opacity: 0.5;
}
/* paper tooth */
.ttt__sheet::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle at 50% 50%, rgba(52,58,64,0.45) 0.5px, transparent 0.6px);
  background-size: 5px 5px;
  opacity: 0.14;
  mix-blend-mode: multiply;
}

/* red margin rule + punched holes down the left edge */
.ttt__margin {
  position: absolute; top: 0; bottom: 0; left: 62px;
  width: 1px; background: var(--margin); opacity: 0.45; z-index: 1;
}
.ttt__holes {
  position: absolute; top: 0; bottom: 0; left: 24px;
  width: 13px; z-index: 2;
  display: flex; flex-direction: column; justify-content: space-evenly;
  padding: 8% 0;
}
.ttt__hole {
  width: 13px; height: 13px; border-radius: 50%;
  background: var(--desk-2);
  box-shadow:
    inset 0 2px 2px rgba(0,0,0,0.75),
    inset 0 -1px 1px rgba(255,255,255,0.12),
    0 1px 0 rgba(255,255,255,0.65);
}
@media (max-width: 720px) {
  .ttt__margin { left: 30px; }
  .ttt__holes { left: 8px; width: 10px; }
  .ttt__hole { width: 10px; height: 10px; }
}

.ttt__inner { position: relative; z-index: 3; }

/* — masthead — */
/* sits on the desk, above the sheet */
.ttt__back {
  display: inline-flex; align-items: center; gap: 8px;
  margin: 0 0 20px;
  font-size: 13px; color: #9a9184; text-decoration: none;
  transition: color .15s;
}
.ttt__back:hover { color: #e8eae2; }
.ttt__back:focus-visible { outline: 2px solid #9a9184; outline-offset: 3px; }
.ttt__back svg { width: 13px; height: 13px; }

.ttt__title {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  font-size: clamp(44px, 8vw, 66px);
  line-height: 0.95;
  color: var(--graphite);
  margin: 0;
  transform: rotate(-1deg);
  transform-origin: left center;
}
.ttt__sub {
  margin: 14px 0 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--graphite-2);
  max-width: 44ch;
}
.ttt__sub b { font-weight: 600; color: var(--graphite); }
.ttt__sub .ttt__biro { color: var(--biro); }

/* — the board — */
.ttt__board-wrap {
  margin: 34px 0 0;
  display: flex; justify-content: center;
}
.ttt__board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: min(330px, 78vw);
  aspect-ratio: 1;
}
.ttt__rule { position: absolute; pointer-events: none; z-index: 2; overflow: visible; }
.ttt__rule path {
  fill: none;
  stroke: var(--graphite);
  stroke-width: 2.4;
  stroke-linecap: round;
  opacity: 0.85;
}

.ttt__cell {
  position: relative;
  border: 0; padding: 0; margin: 0;
  background: transparent;
  cursor: pointer;
  display: grid; place-items: center;
  border-radius: 3px;
  transition: background-color .12s;
}
.ttt__cell:disabled { cursor: default; }
.ttt__cell:not(:disabled):hover { background: rgba(147,167,195,0.16); }
.ttt__cell:focus-visible {
  outline: 2px solid var(--biro);
  outline-offset: -3px;
}
.ttt__cell svg { width: 76%; aspect-ratio: 1; height: auto; overflow: visible; }
.ttt__cell path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ttt__cell--x path { stroke: var(--graphite); stroke-width: 7.5; }
.ttt__cell--o path { stroke: var(--biro); stroke-width: 6.4; }

/* the move is written on, not faded in */
@keyframes ttt-write { to { stroke-dashoffset: 0; } }
.ttt__cell path {
  stroke-dasharray: var(--len, 200);
  stroke-dashoffset: var(--len, 200);
  animation: ttt-write .26s ease-out forwards;
}
.ttt__cell path.ttt__s2 { animation-delay: .14s; }

/* the strike-through that ends the game */
.ttt__strike { position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: visible; }
.ttt__strike path {
  fill: none; stroke: var(--margin); stroke-width: 5; stroke-linecap: round;
  stroke-dasharray: 460; stroke-dashoffset: 460;
  animation: ttt-write .42s .18s ease-out forwards;
  opacity: 0.9;
}

/* — status line + action — */
.ttt__status-row {
  margin: 30px 0 0;
  display: flex; flex-wrap: wrap; align-items: baseline;
  justify-content: space-between; gap: 20px;
}
.ttt__status {
  font-family: 'Caveat', cursive;
  font-size: 27px;
  color: var(--graphite);
  min-height: 32px;
}
.ttt__status--win { color: var(--margin); }
.ttt__status--lose { color: var(--biro); }

.ttt__new {
  font-family: 'Archivo', sans-serif;
  font-size: 14px; font-weight: 500;
  color: var(--graphite);
  background: transparent;
  border: 1.5px solid var(--graphite-3);
  border-radius: 2px;
  padding: 9px 20px;
  cursor: pointer;
  transition: background-color .15s, border-color .15s, color .15s;
}
.ttt__new:hover { background: var(--graphite); border-color: var(--graphite); color: var(--paper-warm); }
.ttt__new:focus-visible { outline: 2px solid var(--biro); outline-offset: 2px; }

/* — tally scores, kept in the bottom margin — */
.ttt__scores {
  margin: 34px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--paper-edge);
  display: flex; flex-wrap: wrap; gap: 44px;
}
.ttt__score-k { font-size: 13px; color: var(--graphite-2); margin-bottom: 7px; }
.ttt__tally { display: flex; align-items: flex-end; gap: 7px; min-height: 30px; }
.ttt__tally svg { height: 26px; overflow: visible; }
.ttt__tally path { fill: none; stroke: var(--graphite); stroke-width: 2.6; stroke-linecap: round; }
.ttt__tally--biro path { stroke: var(--biro); }
.ttt__tally-zero { font-family: 'Caveat', cursive; font-size: 24px; color: var(--graphite-3); }

@media (prefers-reduced-motion: reduce) {
  .ttt__cell path, .ttt__strike path { animation: none; stroke-dashoffset: 0; }
}
`;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

function winningLine(squares) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return line;
  }
  return null;
}

// Deterministic wobble so every written mark sits slightly off-true, the way a
// hand puts it down, but never jitters between renders.
const wobble = (i, salt) => (((i * 37 + salt * 61) % 100) / 100 - 0.5) * 2;

const Cross = ({ i }) => {
  const a = wobble(i, 1) * 3.5;
  const b = wobble(i, 2) * 3.5;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path
        d={`M ${18 + a} ${18 + b} L ${82 + b} ${82 - a}`}
        style={{ '--len': 100 }}
      />
      <path
        className="ttt__s2"
        d={`M ${82 - b} ${18 + a} L ${18 - a} ${82 + b}`}
        style={{ '--len': 100 }}
      />
    </svg>
  );
};

const Nought = ({ i }) => {
  const w = wobble(i, 3) * 3;
  // An open arc — a hand-drawn ring rarely closes on itself.
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path
        d={`M 50 ${19 + w} A 31 31 0 1 1 ${41 - w} 20.5`}
        style={{ '--len': 195 }}
      />
    </svg>
  );
};

const Tally = ({ n, biro }) => {
  if (!n) return <span className="ttt__tally-zero">—</span>;
  const groups = [];
  for (let i = 0; i < n; i += 5) groups.push(Math.min(5, n - i));
  return (
    <div className={`ttt__tally${biro ? ' ttt__tally--biro' : ''}`}>
      {groups.map((count, gi) => (
        <svg key={gi} viewBox="0 0 34 26" width={count === 5 ? 34 : count * 7}>
          {Array.from({ length: Math.min(count, 4) }).map((_, si) => (
            <path key={si} d={`M ${3 + si * 7} 3 L ${4 + si * 7} 23`} />
          ))}
          {count === 5 && <path d="M 1 20 L 31 5" />}
        </svg>
      ))}
    </div>
  );
};

const TicTacToePage = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ you: 0, book: 0, draw: 0 });
  const scoredRef = useRef(false);

  const handleClick = useCallback(
    (i) => {
      if (winner || board[i]) return;
      const next = board.slice();
      next[i] = xIsNext ? 'X' : 'O';
      setBoard(next);
      setXIsNext(!xIsNext);
    },
    [board, winner, xIsNext],
  );

  const minimax = useCallback((b, depth, maximizing) => {
    const result = calculateWinner(b);
    if (result === 'X') return -10 + depth;
    if (result === 'O') return 10 - depth;
    if (b.every(Boolean)) return 0;

    if (maximizing) {
      let best = -Infinity;
      for (let i = 0; i < b.length; i++) {
        if (b[i] === null) {
          b[i] = 'O';
          best = Math.max(minimax(b, depth + 1, false), best);
          b[i] = null;
        }
      }
      return best;
    }
    let best = Infinity;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === null) {
        b[i] = 'X';
        best = Math.min(minimax(b, depth + 1, true), best);
        b[i] = null;
      }
    }
    return best;
  }, []);

  const findBestMove = useCallback(
    (b) => {
      let bestScore = -Infinity;
      let move = null;
      for (let i = 0; i < b.length; i++) {
        if (b[i] === null) {
          b[i] = 'O';
          const score = minimax(b, 0, false);
          b[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      return move;
    },
    [minimax],
  );

  useEffect(() => {
    if (!xIsNext && !winner) {
      const t = setTimeout(() => {
        const move = findBestMove(board.slice());
        if (move !== null) handleClick(move);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [xIsNext, winner, board, findBestMove, handleClick]);

  useEffect(() => {
    if (scoredRef.current) return;
    const w = calculateWinner(board);
    if (w) {
      scoredRef.current = true;
      setWinner(w);
      setScores((s) =>
        w === 'X' ? { ...s, you: s.you + 1 } : { ...s, book: s.book + 1 },
      );
    } else if (board.every(Boolean)) {
      scoredRef.current = true;
      setWinner('Draw');
      setScores((s) => ({ ...s, draw: s.draw + 1 }));
    }
  }, [board]);

  const resetGame = () => {
    scoredRef.current = false;
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const line = winner && winner !== 'Draw' ? winningLine(board) : null;

  let status = 'Your turn.';
  let statusMod = '';
  if (winner === 'X') {
    status = 'You win.';
    statusMod = ' ttt__status--win';
  } else if (winner === 'O') {
    status = 'The book wins.';
    statusMod = ' ttt__status--lose';
  } else if (winner === 'Draw') {
    status = 'Nobody wins. Again?';
  } else if (!xIsNext) {
    status = 'The book is thinking…';
  }

  // centre points of the three winning cells, in board percentage space
  const strikePath = line
    ? (() => {
        const pt = (idx) => [
          (idx % 3) * 33.333 + 16.6,
          Math.floor(idx / 3) * 33.333 + 16.6,
        ];
        const [x1, y1] = pt(line[0]);
        const [x2, y2] = pt(line[2]);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const ext = 7;
        return `M ${x1 - (dx / len) * ext} ${y1 - (dy / len) * ext} L ${
          x2 + (dx / len) * ext
        } ${y2 + (dy / len) * ext}`;
      })()
    : null;

  return (
    <div className="ttt">
      <style>{CSS}</style>
      <Seo
        title="Tic Tac Toe | Fezcodex"
        description="Noughts and crosses against an opponent that never makes a mistake. The best you can do is draw."
        keywords={['Fezcodex', 'tic tac toe', 'noughts and crosses', 'game']}
      />

      <div className="ttt__shell">
        <Link to="/apps" className="ttt__back">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M10 3 L5 8 L10 13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to apps
        </Link>

        <div className="ttt__sheet">
          <div className="ttt__margin" aria-hidden="true" />
          <div className="ttt__holes" aria-hidden="true">
            <div className="ttt__hole" />
            <div className="ttt__hole" />
            <div className="ttt__hole" />
          </div>
          <div className="ttt__inner">
            <h1 className="ttt__title">Tic tac toe</h1>
            <p className="ttt__sub">
              You are <b>✕</b>, in pencil. The book is{' '}
              <span className="ttt__biro">
                <b>○</b>
              </span>
              , in biro — and it never makes a mistake. The best you can get is
              a draw.
            </p>

            <div className="ttt__board-wrap">
              <div className="ttt__board">
                <svg
                  className="ttt__rule"
                  style={{ inset: 0, width: '100%', height: '100%' }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M 33.7 7 L 33.0 93" />
                  <path d="M 66.6 8 L 67.2 94" />
                  <path d="M 7 33.2 L 93 33.8" />
                  <path d="M 8 67.0 L 94 66.5" />
                </svg>

                {board.map((square, i) => (
                  <button
                    key={i}
                    className={`ttt__cell${square === 'X' ? ' ttt__cell--x' : ''}${
                      square === 'O' ? ' ttt__cell--o' : ''
                    }`}
                    onClick={() => handleClick(i)}
                    disabled={!!winner || !!square || !xIsNext}
                    aria-label={
                      square
                        ? `Square ${i + 1}, ${square === 'X' ? 'yours' : 'the book’s'}`
                        : `Play square ${i + 1}`
                    }
                  >
                    {square === 'X' && <Cross i={i} />}
                    {square === 'O' && <Nought i={i} />}
                  </button>
                ))}

                {strikePath && (
                  <svg
                    className="ttt__strike"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d={strikePath} vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </div>
            </div>

            <div className="ttt__status-row">
              <p className={`ttt__status${statusMod}`} role="status">
                {status}
              </p>
              <button className="ttt__new" onClick={resetGame}>
                New game
              </button>
            </div>

            <div className="ttt__scores">
              <div>
                <div className="ttt__score-k">You</div>
                <Tally n={scores.you} />
              </div>
              <div>
                <div className="ttt__score-k">The book</div>
                <Tally n={scores.book} biro />
              </div>
              <div>
                <div className="ttt__score-k">Draws</div>
                <Tally n={scores.draw} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToePage;
