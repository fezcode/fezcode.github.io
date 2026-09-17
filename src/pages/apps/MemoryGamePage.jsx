import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only. No shared chrome.
// Aesthetic: an engraved deck. Backs carry a guilloche lattice, faces carry a
// single line-engraved emblem. A found pair is not hidden away — it stays on
// the table, struck in gold, so the board reads as a record of what you know.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Karla:wght@400;500;600&display=swap');

.mem {
  --table:     #17202b;
  --table-2:   #0f151d;
  --stock:     #f1ead8;
  --stock-2:   #ddd3ba;
  --indigo:    #2c4a72;
  --indigo-2:  #1d3050;
  --gold:      #c2a049;
  --gold-2:    #8d7328;
  --quiet:     #8a99ab;

  font-family: 'Karla', system-ui, sans-serif;
  color: var(--stock);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 60% 45% at 50% 0%, rgba(160,190,225,0.09), transparent 70%),
    var(--table);
  padding: 40px 20px 80px;
}

.mem__shell { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }

.mem__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13.5px; color: var(--quiet); text-decoration: none;
  transition: color .15s;
}
.mem__back:hover { color: var(--stock); }
.mem__back:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.mem__back svg { width: 13px; height: 13px; }

.mem__head {
  margin: 26px 0 0;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; flex-wrap: wrap;
  border-bottom: 1px solid rgba(241,234,216,0.16); padding-bottom: 18px;
}
.mem__title {
  font-family: 'EB Garamond', Garamond, serif;
  font-weight: 500; font-size: clamp(32px, 6vw, 46px);
  line-height: 1; margin: 0; letter-spacing: -0.008em;
}
.mem__sub {
  font-size: 14.5px; line-height: 1.55; color: var(--quiet);
  margin: 9px 0 0; max-width: 42ch;
}

/* — the readouts, set as a plain line of figures — */
.mem__figures { display: flex; gap: 26px; align-items: baseline; }
.mem__fig-n {
  font-family: 'EB Garamond', serif; font-size: 30px; font-weight: 500;
  line-height: 1; font-variant-numeric: tabular-nums;
}
.mem__fig-k { font-size: 12.5px; color: var(--quiet); margin-top: 3px; }
.mem__fig--done .mem__fig-n { color: var(--gold); }

/* — the table — */
.mem__grid {
  margin: 32px 0 0;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
@media (min-width: 620px) { .mem__grid { grid-template-columns: repeat(8, 1fr); } }

.mem__slot { perspective: 900px; }
.mem__card {
  position: relative; display: block; width: 100%; aspect-ratio: 5 / 7;
  border: 0; padding: 0; background: none; cursor: pointer;
  border-radius: 5px;
}
.mem__card:disabled { cursor: default; }
.mem__card:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* a button cannot hold a 3D context reliably, so an inner box does the turning */
.mem__inner {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transition: transform .42s cubic-bezier(.3,.8,.35,1);
}
.mem__inner--up { transform: rotateY(180deg); }

.mem__face {
  position: absolute; inset: 0; display: block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.45);
}
.mem__face--front { display: grid; place-items: center; }

/* back: guilloche lattice engraved on indigo */
.mem__face--back {
  background-color: #2c4a72;
  background-image:
    repeating-linear-gradient(45deg, rgba(241,234,216,0.20) 0 1px, transparent 1px 7px),
    repeating-linear-gradient(-45deg, rgba(241,234,216,0.20) 0 1px, transparent 1px 7px);
  border: 1px solid #16283f;
}
.mem__face--back::after {
  content: ""; position: absolute; inset: 5px;
  border: 1px solid rgba(241,234,216,0.45);
  border-radius: 2px;
}

/* face: ivory stock, engraved emblem */
.mem__face--front {
  transform: rotateY(180deg);
  background: linear-gradient(170deg, var(--stock), var(--stock-2));
  border: 1px solid #b9ac8d;
}
.mem__face--front::after {
  content: ""; position: absolute; inset: 4px;
  border: 1px solid rgba(44,74,114,0.35);
  border-radius: 2px;
}
.mem__emblem { width: 64%; height: 64%; }
.mem__emblem path, .mem__emblem circle {
  fill: none; stroke: #2c4a72; stroke-width: 4;
  stroke-linecap: round; stroke-linejoin: round;
}

/* a found pair stays on the table, struck in gold */
.mem__card--done .mem__face--front {
  background: linear-gradient(170deg, #f4edda, #e6d9b4);
  border-color: var(--gold-2);
  box-shadow: 0 0 0 1px var(--gold-2), 0 2px 10px rgba(194,160,73,0.25);
}
.mem__card--done .mem__emblem path, .mem__card--done .mem__emblem circle { stroke: var(--gold-2); }
.mem__card--done { opacity: 0.92; }

/* — the deal / result bar — */
.mem__bar {
  margin: 30px 0 0; padding-top: 18px;
  border-top: 1px solid rgba(241,234,216,0.16);
  display: flex; align-items: center; justify-content: space-between;
  gap: 18px; flex-wrap: wrap;
}
.mem__note {
  font-family: 'EB Garamond', serif; font-size: 17px; font-style: italic;
  color: var(--quiet);
}
.mem__note b { font-style: normal; font-weight: 500; color: var(--gold); }

.mem__btn {
  font-family: 'Karla', sans-serif; font-size: 14px; font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--stock); color: #17202b;
  border: 0; border-radius: 3px; padding: 11px 24px; cursor: pointer;
  transition: background-color .15s, color .15s;
}
.mem__btn:hover { background: var(--gold); }
.mem__btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.mem__btn--quiet {
  background: transparent; color: var(--quiet);
  box-shadow: inset 0 0 0 1px rgba(241,234,216,0.3);
}
.mem__btn--quiet:hover { background: transparent; color: var(--stock); box-shadow: inset 0 0 0 1px var(--stock); }

@media (prefers-reduced-motion: reduce) {
  .mem__inner { transition: none; }
}
`;

// Eight line-engraved emblems — the vocabulary of an engraved deck, and far
// easier to tell apart at a glance than eight pieces of fruit.
const EMBLEMS = {
  anchor:
    'M50 22v58M50 22a7 7 0 1 0 0 1M32 40h36M24 62c0 14 12 22 26 22s26-8 26-22',
  crown: 'M24 72h52M24 72 20 34l17 14 13-22 13 22 17-14-4 38',
  key: 'M38 38a13 13 0 1 0 0 1M48 48l30 30M66 66l8 8M58 58l8 8',
  star: 'M50 20 60 43l24 3-18 17 5 24-21-12-21 12 5-24-18-17 24-3z',
  moon: 'M62 22a32 32 0 1 0 0 56 26 26 0 0 1 0-56z',
  bell: 'M30 68c6-6 6-12 6-22a14 14 0 0 1 28 0c0 10 0 16 6 22zM42 76a8 8 0 0 0 16 0',
  wheel:
    'M50 20a30 30 0 1 0 0 60 30 30 0 0 0 0-60zM50 12v16M50 72v16M12 50h16M72 50h16M23 23l11 11M66 66l11 11M77 23 66 34M34 66 23 77',
  glass:
    'M30 18h40M30 82h40M34 18c0 16 16 24 16 32s-16 16-16 32M66 18c0 16-16 24-16 32s16 16 16 32',
};
const CARD_VALUES = Object.keys(EMBLEMS);

const MemoryGamePage = () => {
  const { unlockAchievement } = useAchievements();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const shuffleCards = useCallback((values) => {
    let id = 0;
    const initialCards = [...values, ...values].map((value) => ({
      id: id++,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }
    return initialCards;
  }, []);

  const initializeGame = useCallback(() => {
    setCards(shuffleCards(CARD_VALUES));
    setFlippedCards([]);
    setMatchesFound(0);
    setMoves(0);
    setGameOver(false);
    setGameStarted(false);
    setStartTime(null);
  }, [shuffleCards]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };

  const handleCardClick = useCallback(
    (clickedCard) => {
      if (
        !gameStarted ||
        gameOver ||
        clickedCard.isFlipped ||
        clickedCard.isMatched ||
        flippedCards.length === 2
      ) {
        return;
      }
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === clickedCard.id ? { ...card, isFlipped: true } : card,
        ),
      );
      setFlippedCards((prev) => [...prev, clickedCard.id]);
    },
    [gameStarted, gameOver, flippedCards.length],
  );

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card,
            ),
          );
          setMatchesFound((prev) => prev + 1);
          setFlippedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card,
            ),
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchesFound === CARD_VALUES.length && gameStarted) {
      setGameOver(true);
      const duration = (Date.now() - startTime) / 1000;
      if (duration < 45) unlockAchievement('combo_breaker');
      if (moves <= 24) unlockAchievement('sharp_eye');
      if (moves <= 18) unlockAchievement('eidetic_memory');
      if (moves <= 14) unlockAchievement('mind_palace');
    }
  }, [matchesFound, moves, unlockAchievement, startTime, gameStarted]);

  return (
    <div className="mem">
      <style>{CSS}</style>
      <Seo
        title="Memory Game | Fezcodex"
        description="Turn the cards two at a time and remember where the pairs are."
        keywords={[
          'Fezcodex',
          'memory game',
          'match pairs',
          'brain game',
          'concentration',
        ]}
        ogImage="/images/asset/ogtitle.png"
      />

      <div className="mem__shell">
        <Link to="/apps" className="mem__back">
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

        <div className="mem__head">
          <div>
            <h1 className="mem__title">Memory</h1>
            <p className="mem__sub">
              Sixteen cards, eight pairs. Turn two at a time and remember where
              everything was.
            </p>
          </div>
          <div className="mem__figures">
            <div>
              <div className="mem__fig-n">{moves}</div>
              <div className="mem__fig-k">turns</div>
            </div>
            <div className={gameOver ? 'mem__fig--done' : ''}>
              <div className="mem__fig-n">
                {matchesFound}/{CARD_VALUES.length}
              </div>
              <div className="mem__fig-k">pairs</div>
            </div>
          </div>
        </div>

        <div className="mem__grid">
          {cards.map((card) => {
            const up = card.isFlipped || card.isMatched;
            return (
              <div className="mem__slot" key={card.id}>
                <button
                  className={`mem__card${card.isMatched ? ' mem__card--done' : ''}`}
                  onClick={() => handleCardClick(card)}
                  disabled={!gameStarted || card.isMatched || up}
                  aria-label={up ? card.value : 'Face-down card'}
                >
                  <span className={`mem__inner${up ? ' mem__inner--up' : ''}`}>
                    <span className="mem__face mem__face--back" />
                    <span className="mem__face mem__face--front">
                      <svg
                        className="mem__emblem"
                        viewBox="0 0 100 100"
                        aria-hidden="true"
                      >
                        <path d={EMBLEMS[card.value]} />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mem__bar">
          <p className="mem__note" role="status">
            {gameOver ? (
              <>
                All eight found in <b>{moves}</b> turns.
              </>
            ) : gameStarted ? (
              'Turn any two cards.'
            ) : (
              'The deck is shuffled and face down.'
            )}
          </p>
          {gameStarted && !gameOver ? (
            <button
              className="mem__btn mem__btn--quiet"
              onClick={initializeGame}
            >
              Shuffle again
            </button>
          ) : (
            <button
              className="mem__btn"
              onClick={gameOver ? initializeGame : startGame}
            >
              {gameOver ? 'Deal again' : 'Deal'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryGamePage;
