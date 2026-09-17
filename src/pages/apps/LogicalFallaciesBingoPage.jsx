import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only. No shared chrome.
// Aesthetic: a bingo hall card. Pulpy tinted stock, fat slab masthead, and
// marking a square blots it with a translucent dauber that never lands quite
// straight. A finished card gets the rubber stamp, as a validated one would.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Ultra&family=Archivo+Narrow:wght@400;500;600;700&display=swap');

.bgo {
  --table:   #2a2320;
  --table-2: #1b1613;
  --card:    #dde5c9;
  --card-2:  #ccd6b3;
  --card-3:  #bcc8a0;
  --print:   #1c1f18;
  --print-2: #5d6552;
  --print-3: #8b9280;
  --dauber:  #8e3b93;

  font-family: 'Archivo Narrow', system-ui, sans-serif;
  color: var(--card);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,230,200,0.08), transparent 70%),
    var(--table-2);
  padding: 40px 20px 80px;
}

.bgo__shell { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }

.bgo__back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 14px; color: #9c9184; text-decoration: none; transition: color .15s;
}
.bgo__back:hover { color: var(--card); }
.bgo__back:focus-visible { outline: 2px solid var(--dauber); outline-offset: 3px; }
.bgo__back svg { width: 13px; height: 13px; }

.bgo__lede { margin: 24px 0 0; max-width: 52ch; }
.bgo__lede h1 {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: clamp(26px, 4.6vw, 34px); font-weight: 700;
  line-height: 1.05; margin: 0; color: var(--card);
}
.bgo__lede p { font-size: 15px; line-height: 1.55; color: #9c9184; margin: 9px 0 0; }

/* — the card — */
.bgo__card {
  position: relative;
  margin: 30px 0 0;
  background: var(--card);
  color: var(--print);
  padding: 12px;
  border-radius: 2px;
  box-shadow: 0 20px 44px -18px rgba(0,0,0,0.85), 0 2px 5px rgba(0,0,0,0.4);
}
/* cheap stock speckle */
.bgo__card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  border-radius: 2px;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(28,31,24,0.6) 0.5px, transparent 0.6px),
    radial-gradient(circle at 70% 60%, rgba(28,31,24,0.4) 0.5px, transparent 0.6px);
  background-size: 6px 6px, 9px 9px;
  opacity: 0.2; mix-blend-mode: multiply;
}

.bgo__head {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;
  margin: 0 0 4px;
  background: var(--print); padding: 4px; border-radius: 2px;
}
.bgo__head span {
  font-family: 'Ultra', Georgia, serif;
  font-size: clamp(22px, 4.4vw, 34px);
  line-height: 1.1; text-align: center; color: var(--card);
  padding: 4px 0 6px;
}

.bgo__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }

.bgo__sq {
  position: relative; overflow: hidden;
  aspect-ratio: 1.22;
  background: var(--card-2);
  border: 1px solid var(--card-3);
  border-radius: 2px;
  padding: 8px 8px;
  cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; text-align: center;
  font-family: inherit;
  transition: background-color .12s;
}
.bgo__sq:hover { background: #d4dfb9; }
.bgo__sq:focus-visible { outline: 3px solid var(--dauber); outline-offset: -3px; }
.bgo__sq-n {
  font-size: clamp(11px, 1.6vw, 15px); font-weight: 700;
  line-height: 1.1; color: var(--print);
  letter-spacing: -0.008em;
}
.bgo__sq-d {
  font-size: clamp(9px, 1.15vw, 11px); font-weight: 400;
  line-height: 1.3; color: var(--print-2);
  display: none;
}
@media (min-width: 680px) { .bgo__sq-d { display: block; } }

.bgo__sq--free { background: var(--card-3); }
.bgo__sq--free .bgo__sq-n { font-family: 'Ultra', Georgia, serif; font-size: clamp(13px, 2vw, 19px); font-weight: 400; }

/* the dauber blot — translucent, never quite straight, never quite round */
.bgo__blot {
  position: absolute; left: 50%; top: 50%;
  width: 78%; height: 78%;
  transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(1);
  border-radius: 48% 52% 50% 50% / 52% 48% 52% 48%;
  background: radial-gradient(circle at 42% 38%, rgba(142,59,147,0.52), rgba(142,59,147,0.40) 62%, rgba(142,59,147,0.28));
  mix-blend-mode: multiply;
  pointer-events: none;
  animation: bgo-stamp .16s cubic-bezier(.3,1.5,.5,1);
}
@keyframes bgo-stamp {
  from { transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(0.55); opacity: 0.3; }
}

/* — footer of the card — */
.bgo__foot {
  margin: 26px 0 0; display: flex; align-items: center;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.bgo__count { font-size: 15px; color: #9c9184; }
.bgo__count b { color: var(--card); font-weight: 700; font-variant-numeric: tabular-nums; }
.bgo__new {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 14.5px; font-weight: 600;
  background: var(--card); color: var(--table-2);
  border: 0; border-radius: 3px; padding: 11px 24px; cursor: pointer;
  transition: background-color .15s, color .15s;
}
.bgo__new:hover { background: var(--dauber); color: #fff; }
.bgo__new:focus-visible { outline: 2px solid var(--dauber); outline-offset: 3px; }

/* — the rubber stamp on a finished card — */
.bgo__stamp {
  position: absolute; right: 4%; top: 38%;
  transform: rotate(-13deg);
  border: 5px solid var(--dauber);
  border-radius: 6px;
  padding: 6px 20px 8px;
  color: var(--dauber);
  font-family: 'Ultra', Georgia, serif;
  font-size: clamp(30px, 7vw, 58px); line-height: 1;
  opacity: 0.82;
  mix-blend-mode: multiply;
  pointer-events: none;
  animation: bgo-slam .22s cubic-bezier(.3,1.4,.5,1);
}
@keyframes bgo-slam {
  from { transform: rotate(-13deg) scale(1.7); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .bgo__blot, .bgo__stamp { animation: none; }
}
`;

const FALLACIES = [
  { name: 'Ad hominem', desc: 'Attacking the person instead of the argument.' },
  {
    name: 'Straw man',
    desc: 'Misrepresenting an argument to make it easier to attack.',
  },
  {
    name: 'Slippery slope',
    desc: 'Assuming a small step leads to a chain of extreme events.',
  },
  {
    name: 'False dilemma',
    desc: 'Presenting only two options when more exist.',
  },
  { name: 'Post hoc', desc: 'Assuming A caused B because A happened first.' },
  {
    name: 'Whataboutism',
    desc: 'Deflecting by bringing up a different issue.',
  },
  { name: 'Red herring', desc: 'Introducing an irrelevant topic to distract.' },
  {
    name: 'Confirmation bias',
    desc: 'Favouring information that confirms existing beliefs.',
  },
  {
    name: 'Sunk cost',
    desc: 'Continuing because of past investment, not future value.',
  },
  {
    name: 'Dunning-Kruger',
    desc: 'Overestimating ability when knowledge is low.',
  },
  {
    name: 'No true Scotsman',
    desc: 'Changing the definition to exclude counter-examples.',
  },
  { name: 'Texas sharpshooter', desc: 'Cherry-picking data to fit a pattern.' },
  {
    name: 'Moving goalposts',
    desc: 'Changing the criteria for proof after evidence is met.',
  },
  {
    name: 'Begging the question',
    desc: 'The premise assumes the conclusion is true.',
  },
  {
    name: 'Appeal to authority',
    desc: 'Saying it is true because an expert said so.',
  },
  {
    name: 'Appeal to emotion',
    desc: 'Manipulating feelings instead of using logic.',
  },
  {
    name: 'Bandwagon',
    desc: 'Saying it is true because many people believe it.',
  },
  {
    name: 'Appeal to ignorance',
    desc: 'Assuming true because not proven false.',
  },
  {
    name: 'Burden of proof',
    desc: 'Making a claim but expecting others to disprove it.',
  },
  {
    name: 'Personal incredulity',
    desc: 'Saying it is false because it is hard to understand.',
  },
  { name: 'Ambiguity', desc: 'Using double meanings to mislead.' },
  { name: 'Genetic fallacy', desc: 'Judging something by where it came from.' },
  {
    name: 'Middle ground',
    desc: 'Assuming the truth sits between two extremes.',
  },
  { name: 'Anecdotal', desc: 'Using one story in place of sound evidence.' },
];

const WINNING_LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

// Deterministic per-square, so a blot never re-rolls its angle on rerender.
const blotRotation = (i) => `${(((i * 53) % 17) - 8) * 1.4}deg`;

function LogicalFallaciesBingoPage() {
  const [grid, setGrid] = useState([]);
  const [marked, setMarked] = useState(new Set());
  const [bingo, setBingo] = useState(false);

  const shuffleAndGenerate = () => {
    const shuffled = [...FALLACIES].sort(() => Math.random() - 0.5);
    const newGrid = [];
    let index = 0;
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        newGrid.push({
          name: 'Free',
          desc: 'You are on the internet.',
          isFree: true,
        });
      } else {
        newGrid.push(shuffled[index]);
        index++;
      }
    }
    setGrid(newGrid);
    setMarked(new Set([12]));
    setBingo(false);
  };

  useEffect(() => {
    shuffleAndGenerate();
  }, []);

  const checkBingo = (currentMarked) => {
    setBingo(
      WINNING_LINES.some((line) =>
        line.every((index) => currentMarked.has(index)),
      ),
    );
  };

  const toggleMark = (index) => {
    if (index === 12) return;
    const newMarked = new Set(marked);
    if (newMarked.has(index)) newMarked.delete(index);
    else newMarked.add(index);
    setMarked(newMarked);
    checkBingo(newMarked);
  };

  return (
    <div className="bgo">
      <style>{CSS}</style>
      <Seo
        title="Logical Fallacies Bingo | Fezcodex"
        description="A bingo card of the arguments you meet online. Mark them off as they turn up."
        keywords={[
          'bingo',
          'logical fallacies',
          'game',
          'logic',
          'internet arguments',
        ]}
      />

      <div className="bgo__shell">
        <Link to="/apps" className="bgo__back">
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

        <div className="bgo__lede">
          <h1>Logical fallacies bingo</h1>
          <p>
            Take this into any comment section. Dab a square when you spot one;
            five in a row and the card is yours.
          </p>
        </div>

        <div className="bgo__card">
          <div className="bgo__head" aria-hidden="true">
            <span>B</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
            <span>O</span>
          </div>

          <div className="bgo__grid">
            {grid.map((cell, i) => {
              const isMarked = marked.has(i);
              return (
                <button
                  key={i}
                  className={`bgo__sq${cell.isFree ? ' bgo__sq--free' : ''}`}
                  onClick={() => toggleMark(i)}
                  aria-pressed={isMarked}
                  disabled={cell.isFree}
                  title={cell.desc}
                >
                  <span className="bgo__sq-n">{cell.name}</span>
                  <span className="bgo__sq-d">{cell.desc}</span>
                  {isMarked && (
                    <span
                      className="bgo__blot"
                      style={{ '--rot': blotRotation(i) }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {bingo && <div className="bgo__stamp">Bingo</div>}
        </div>

        <div className="bgo__foot">
          <p className="bgo__count" role="status">
            {bingo ? (
              <>
                That is five in a row — <b>{marked.size}</b> dabbed in all.
              </>
            ) : (
              <>
                <b>{marked.size}</b> of 25 dabbed.
              </>
            )}
          </p>
          <button className="bgo__new" onClick={shuffleAndGenerate}>
            New card
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogicalFallaciesBingoPage;
