import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only. No shared chrome.
// Aesthetic: a split-flap board. The game is four changing digits, so it is
// housed in the machine built for exactly that. One typeface throughout, as a
// real board has. Feedback is two machined markers — filled for a digit in its
// place, hollow for a digit that belongs elsewhere.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.bnc {
  --board:    #23262a;
  --board-2:  #16181b;
  --board-3:  #2c3036;
  --flap:     #efeadf;
  --flap-2:   #d5cfc0;
  --hinge:    #9d9687;
  --bull:     #b5442f;
  --cow:      #d99a2b;
  --quiet:    #8d9198;
  --quiet-2:  #5f646b;

  font-family: 'Space Grotesk', system-ui, sans-serif;
  color: var(--flap);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.05), transparent 70%),
    var(--board-2);
  padding: 40px 20px 80px;
}

.bnc__shell { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; }

.bnc__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13.5px; color: var(--quiet); text-decoration: none;
  transition: color .15s;
}
.bnc__back:hover { color: var(--flap); }
.bnc__back:focus-visible { outline: 2px solid var(--cow); outline-offset: 3px; }
.bnc__back svg { width: 13px; height: 13px; }

.bnc__head {
  margin: 26px 0 0; display: flex; justify-content: space-between;
  align-items: flex-end; gap: 22px; flex-wrap: wrap;
}
.bnc__title {
  font-size: clamp(30px, 5.6vw, 42px); font-weight: 700;
  letter-spacing: -0.022em; line-height: 1; margin: 0;
}
.bnc__sub {
  font-size: 14.5px; line-height: 1.55; color: var(--quiet);
  margin: 10px 0 0; max-width: 44ch;
}
.bnc__left { font-size: 14px; color: var(--quiet); }
.bnc__left b { color: var(--flap); font-weight: 600; font-variant-numeric: tabular-nums; }

/* — the flap row you type into — */
.bnc__entry {
  margin: 30px 0 0; padding: 20px;
  background: var(--board); border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px -14px #000;
}
.bnc__flaps { display: flex; gap: 10px; justify-content: center; cursor: text; }
.bnc__flap {
  position: relative; width: 58px; height: 78px; border-radius: 4px;
  background: linear-gradient(180deg, var(--flap) 0 50%, var(--flap-2) 50% 100%);
  color: #1d1f22;
  display: grid; place-items: center;
  font-size: 44px; font-weight: 500; line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
/* the hinge line across the middle of every flap */
.bnc__flap::after {
  content: ""; position: absolute; left: 0; right: 0; top: 50%;
  height: 2px; transform: translateY(-1px);
  background: rgba(0,0,0,0.30);
}
.bnc__flap--empty { background: var(--board-3); color: transparent; box-shadow: inset 0 0 0 1px #3a3f46; }
.bnc__flap--empty::after { background: rgba(0,0,0,0.35); }
.bnc__flaps:focus-within .bnc__flap--next { box-shadow: 0 0 0 2px var(--cow); }

.bnc__input {
  position: absolute; opacity: 0; pointer-events: none;
  width: 1px; height: 1px;
}

.bnc__actions { margin: 18px 0 0; display: flex; gap: 10px; justify-content: center; align-items: center; }
.bnc__go {
  font-family: inherit; font-size: 14.5px; font-weight: 600;
  background: var(--flap); color: #1d1f22;
  border: 0; border-radius: 4px; padding: 11px 26px; cursor: pointer;
  transition: background-color .15s, opacity .15s;
}
.bnc__go:hover:not(:disabled) { background: var(--cow); }
.bnc__go:disabled { opacity: 0.35; cursor: default; }
.bnc__go:focus-visible { outline: 2px solid var(--cow); outline-offset: 3px; }
.bnc__ghost {
  font-family: inherit; font-size: 14px; color: var(--quiet);
  background: none; border: 0; cursor: pointer; padding: 11px 10px;
}
.bnc__ghost:hover { color: var(--flap); }
.bnc__ghost:focus-visible { outline: 2px solid var(--cow); outline-offset: 2px; }

/* — the key to the markers — */
.bnc__key {
  margin: 24px 0 0; display: flex; gap: 22px; flex-wrap: wrap;
  font-size: 13px; color: var(--quiet);
}
.bnc__key span { display: inline-flex; align-items: center; gap: 7px; }

.bnc__pip { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
.bnc__pip--bull { background: var(--bull); }
.bnc__pip--cow { background: transparent; box-shadow: inset 0 0 0 2px var(--cow); }
.bnc__pip--none { background: transparent; box-shadow: inset 0 0 0 1px #40454c; }

/* — the log of attempts — */
.bnc__log { margin: 22px 0 0; display: flex; flex-direction: column; gap: 6px; }
.bnc__row {
  display: flex; align-items: center; gap: 16px;
  background: var(--board); border-radius: 5px; padding: 11px 16px;
}
.bnc__row-n { font-size: 12.5px; color: var(--quiet-2); width: 20px; font-variant-numeric: tabular-nums; }
.bnc__row-digits { display: flex; gap: 7px; }
.bnc__row-digit {
  width: 27px; height: 34px; border-radius: 3px;
  background: linear-gradient(180deg, var(--flap) 0 50%, var(--flap-2) 50% 100%);
  color: #1d1f22; display: grid; place-items: center;
  font-size: 18px; font-weight: 500; font-variant-numeric: tabular-nums;
}
.bnc__row-pips { display: flex; gap: 5px; margin-left: auto; }
.bnc__row-say { font-size: 13px; color: var(--quiet); min-width: 74px; text-align: right; }

/* — the verdict — */
.bnc__verdict {
  margin: 24px 0 0; padding: 18px 20px; border-radius: 6px;
  background: var(--board); border-left: 3px solid var(--cow);
  font-size: 15.5px; line-height: 1.5;
}
.bnc__verdict--won { border-left-color: var(--bull); }
.bnc__verdict b { font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0.1em; }

.bnc__empty { margin: 22px 0 0; font-size: 14.5px; color: var(--quiet-2); }

@media (max-width: 560px) {
  .bnc__flap { width: 46px; height: 62px; font-size: 34px; }
  .bnc__row-say { display: none; }
}
`;

const MAX_GUESSES = 10;

const MastermindPage = () => {
  const { addToast } = useToast();
  const [secretCode, setSecretCode] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const inputRef = useRef(null);

  const generateSecretCode = useCallback(() => {
    const digits = '0123456789'.split('');
    let code = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      code += digits.splice(randomIndex, 1)[0];
    }
    setSecretCode(code);
  }, []);

  useEffect(() => {
    generateSecretCode();
  }, [generateSecretCode]);

  const valid =
    currentGuess.length === 4 &&
    /^\d{4}$/.test(currentGuess) &&
    new Set(currentGuess).size === 4;

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (gameOver) return;

    if (!valid) {
      addToast({
        title: 'Four different digits',
        message: 'Each digit can only appear once.',
        duration: 3000,
      });
      return;
    }

    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < 4; i++) {
      if (currentGuess[i] === secretCode[i]) bulls++;
      else if (secretCode.includes(currentGuess[i])) cows++;
    }

    const newGuesses = [
      { guess: currentGuess, bulls, cows, id: Date.now() },
      ...guesses,
    ];
    setGuesses(newGuesses);

    if (bulls === 4) {
      setGameOver(true);
      setWon(true);
      addToast({
        title: 'Cracked it',
        message: `${secretCode} in ${newGuesses.length} guesses.`,
        type: 'success',
      });
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      addToast({
        title: 'Out of guesses',
        message: `The code was ${secretCode}.`,
        type: 'error',
      });
    }

    setCurrentGuess('');
  };

  const handleResetGame = () => {
    generateSecretCode();
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    inputRef.current?.focus();
  };

  const chars = currentGuess.padEnd(4, ' ').split('');

  return (
    <div className="bnc">
      <style>{CSS}</style>
      <Seo
        title="Mastermind | Fezcodex"
        description="Work out a four-digit code from bulls-and-cows feedback, in ten guesses or fewer."
        keywords={['Fezcodex', 'mastermind', 'bulls and cows', 'code breaking']}
      />

      <div className="bnc__shell">
        <Link to="/apps" className="bnc__back">
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

        <div className="bnc__head">
          <div>
            <h1 className="bnc__title">Bulls and cows</h1>
            <p className="bnc__sub">
              A hidden code of four different digits. Each guess tells you how
              many are right, and how many are right but misplaced.
            </p>
          </div>
          <div className="bnc__left">
            <b>{MAX_GUESSES - guesses.length}</b> guesses left
          </div>
        </div>

        <form className="bnc__entry" onSubmit={handleGuessSubmit}>
          <div
            className="bnc__flaps"
            onClick={() => inputRef.current?.focus()}
            role="presentation"
          >
            {chars.map((c, i) => (
              <div
                key={i}
                className={`bnc__flap${c === ' ' ? ' bnc__flap--empty' : ''}${
                  i === currentGuess.length ? ' bnc__flap--next' : ''
                }`}
              >
                {c === ' ' ? '0' : c}
              </div>
            ))}
            <input
              ref={inputRef}
              className="bnc__input"
              value={currentGuess}
              onChange={(e) =>
                setCurrentGuess(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              inputMode="numeric"
              autoComplete="off"
              aria-label="Your four-digit guess"
              disabled={gameOver}
            />
          </div>

          <div className="bnc__actions">
            <button
              className="bnc__go"
              type="submit"
              disabled={!valid || gameOver}
            >
              Check
            </button>
            <button
              className="bnc__ghost"
              type="button"
              onClick={handleResetGame}
            >
              New code
            </button>
          </div>
        </form>

        <div className="bnc__key">
          <span>
            <i className="bnc__pip bnc__pip--bull" /> right digit, right place
          </span>
          <span>
            <i className="bnc__pip bnc__pip--cow" /> right digit, wrong place
          </span>
        </div>

        {gameOver && (
          <div
            className={`bnc__verdict${won ? ' bnc__verdict--won' : ''}`}
            role="status"
          >
            {won ? (
              <>
                Cracked it — the code was <b>{secretCode}</b>, found in{' '}
                {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}.
              </>
            ) : (
              <>
                Out of guesses. The code was <b>{secretCode}</b>.
              </>
            )}
          </div>
        )}

        {guesses.length === 0 ? (
          <p className="bnc__empty">
            Type four digits to make your first guess.
          </p>
        ) : (
          <div className="bnc__log">
            {guesses.map((g, idx) => (
              <div className="bnc__row" key={g.id}>
                <span className="bnc__row-n">{guesses.length - idx}</span>
                <span className="bnc__row-digits">
                  {g.guess.split('').map((d, i) => (
                    <span className="bnc__row-digit" key={i}>
                      {d}
                    </span>
                  ))}
                </span>
                <span className="bnc__row-pips">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <i
                      key={i}
                      className={`bnc__pip bnc__pip--${
                        i < g.bulls
                          ? 'bull'
                          : i < g.bulls + g.cows
                            ? 'cow'
                            : 'none'
                      }`}
                    />
                  ))}
                </span>
                <span className="bnc__row-say">
                  {g.bulls} in place, {g.cows} moved
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MastermindPage;
