import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';

// ---------------------------------------------------------------------------
// Bespoke design system, scoped to this page only. No shared chrome.
// Aesthetic: a Maelzel wind-up metronome — walnut case, brass rod, ivory scale.
// The mechanism is the readout: the weight slides to the tempo you tapped and
// the pendulum swings at that rate. Italian tempo marks are the real vocabulary
// of this object, so they carry the labelling instead of invented jargon.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;500;600&family=Spectral:ital,wght@0,400;1,300;1,400&display=swap');

.met {
  --room:      #1d1710;
  --room-2:    #120e09;
  --case:      #7c4a24;
  --case-lo:   #4a2a13;
  --case-hi:   #9a6234;
  --case-edge: #2f1a0b;
  --brass:     #c8a13f;
  --ivory:     #e7dcc2;
  --ivory-dim: #b4a888;
  --ink:       #2a2017;
  --red:       #a8342a;

  font-family: 'Barlow Semi Condensed', system-ui, sans-serif;
  color: var(--ivory);
  min-height: 100vh; width: 100%;
  position: relative; overflow-x: hidden;
  background:
    radial-gradient(ellipse 55% 45% at 50% 8%, rgba(255,214,150,0.10), transparent 70%),
    var(--room);
  padding: 44px 20px 90px;
}

.met__shell { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

.met__back {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13.5px; color: #9a8a70; text-decoration: none;
  transition: color .15s;
}
.met__back svg { width: 13px; height: 13px; }

.met__title {
  font-family: 'Spectral', serif;
  font-weight: 400;
  font-size: clamp(30px, 5.4vw, 40px);
  letter-spacing: -0.012em;
  margin: 26px 0 0; color: var(--ivory);
}
.met__sub {
  font-size: 15px; line-height: 1.6; color: var(--ivory-dim);
  max-width: 48ch; margin: 10px 0 0;
}

/* — the instrument — */
.met__stage { display: flex; justify-content: center; margin: 46px 0 0; }
.met__case {
  position: relative;
  width: 380px; height: 530px;
  clip-path: polygon(34% 0, 66% 0, 100% 100%, 0 100%);
  background:
    linear-gradient(90deg, var(--case-lo) 0%, var(--case-hi) 26%, var(--case) 52%, var(--case-lo) 100%);
  box-shadow: 0 26px 50px -18px rgba(0,0,0,0.8);
}
/* wood grain */
.met__case::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: repeating-linear-gradient(
    91deg, rgba(0,0,0,0.13) 0 1px, transparent 1px 7px,
    rgba(255,220,170,0.05) 7px 8px, transparent 8px 15px);
  opacity: 0.8;
}

/* the open slot the pendulum swings in */
.met__slot {
  position: absolute; left: 50%; transform: translateX(-50%);
  top: 32px; width: 150px; height: 376px;
  background: linear-gradient(180deg, #0d0a06, #1b1209);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.9), 0 0 0 2px var(--case-edge);
  overflow: hidden;
}

/* graduated scale, engraved on ivory, numbers descending as tempo rises */
.met__scale {
  position: absolute; left: 12px; top: 16px; bottom: 16px; width: 60px;
  background: linear-gradient(180deg, var(--ivory), #d8cbae);
  border-radius: 1px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 7px 0;
}
.met__tick {
  display: flex; align-items: center; gap: 4px; padding-left: 4px;
  font-size: 13px; color: var(--ink); line-height: 1;
}
.met__tick i {
  display: block; height: 1px; background: var(--ink); opacity: 0.75; width: 13px;
}

/* pendulum: pivots at the bottom of the slot */
.met__rod-pivot {
  position: absolute; left: 50%; bottom: 8px;
  width: 0; height: 0;
  transform-origin: bottom center;
}
.met__rod {
  position: absolute; left: -2px; bottom: 0;
  width: 5px; height: 334px;
  background: linear-gradient(90deg, #8a6a1e, #e3c76a 45%, #a37f22);
  border-radius: 2px;
}
.met__weight {
  position: absolute; left: -18px;
  width: 41px; height: 23px;
  background: linear-gradient(180deg, #d9b63f, #8c6c17);
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,240,190,0.5);
  transition: bottom .5s cubic-bezier(.22,.9,.3,1);
}
.met__bob {
  position: absolute; left: -10px; bottom: -6px;
  width: 24px; height: 24px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #e8c757, #7d6013);
}

@keyframes met-swing {
  0%   { transform: rotate(-13deg); }
  50%  { transform: rotate(13deg); }
  100% { transform: rotate(-13deg); }
}
.met__rod-pivot--ticking { animation: met-swing var(--period, 1s) ease-in-out infinite; }

/* brass plaque on the case front carries the reading */
.met__plaque {
  position: absolute; left: 50%; transform: translateX(-50%);
  bottom: 22px; width: 250px;
  background: linear-gradient(180deg, #d7bc63, #9d7f28);
  border-radius: 2px; padding: 7px 0 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,245,200,0.6);
}
.met__bpm {
  font-size: 54px; font-weight: 600; line-height: 0.95; color: #2b2109;
  font-variant-numeric: tabular-nums;
}
.met__bpm span { font-size: 13px; font-weight: 500; letter-spacing: 0.06em; }
.met__mark {
  font-family: 'Spectral', serif; font-style: italic;
  font-size: 17px; color: #4a3a10; margin-top: 1px;
}

/* — controls — */
.met__controls { margin: 40px 0 0; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.met__tap {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 19px; font-weight: 600; letter-spacing: 0.02em;
  color: #2b2109;
  width: 190px; padding: 15px 0;
  background: linear-gradient(180deg, #e0c46c, #a8862a);
  border: 0; border-radius: 3px;
  box-shadow: 0 4px 0 #6d5518, 0 8px 14px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: transform .05s, box-shadow .05s;
}
.met__tap:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #6d5518, 0 3px 8px rgba(0,0,0,0.5);
}
.met__tap:focus-visible { outline: 2px solid var(--ivory); outline-offset: 3px; }

.met__hint { font-size: 13px; color: #8a7c62; }
.met__hint kbd {
  font-family: inherit; font-size: 12px;
  border: 1px solid #5a4e3a; border-bottom-width: 2px;
  border-radius: 3px; padding: 1px 6px; color: var(--ivory-dim);
}

.met__meta {
  margin: 30px auto 0; max-width: 340px;
  display: flex; justify-content: space-between; align-items: baseline;
  border-top: 1px solid rgba(231,220,194,0.14); padding-top: 14px;
  font-size: 14px; color: var(--ivory-dim);
}
.met__meta b { color: var(--ivory); font-weight: 600; font-variant-numeric: tabular-nums; }
.met__reset {
  background: none; border: 0; padding: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; color: #8a7c62;
  border-bottom: 1px solid transparent;
}
.met__reset:hover { color: var(--ivory); border-bottom-color: #8a7c62; }
.met__reset:focus-visible { outline: 2px solid var(--ivory); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .met__rod-pivot--ticking { animation: none; }
}
@media (max-width: 560px) {
  .met__case { width: 270px; height: 380px; }
  .met__slot { height: 264px; width: 108px; }
  .met__rod { height: 234px; }
}
`;

// Maelzel's own divisions. The scale is read against these, so they label the
// tempo rather than a made-up status word.
const MARKS = [
  [0, ''],
  [40, 'largo'],
  [60, 'larghetto'],
  [66, 'adagio'],
  [76, 'andante'],
  [108, 'moderato'],
  [120, 'allegro'],
  [168, 'presto'],
  [200, 'prestissimo'],
];

const markFor = (bpm) => {
  let out = '';
  for (const [n, name] of MARKS) if (bpm >= n) out = name;
  return out;
};

// slow at the top, where the weight rides high — as it reads on the real scale
const SCALE = [40, 50, 60, 72, 88, 104, 126, 160, 208];

const BpmGuesserPage = () => {
  const [bpm, setBpm] = useState(0);
  const [taps, setTaps] = useState([]);
  const lastTapTime = useRef(0);
  const { unlockAchievement } = useAchievements();

  const prevBpmRef = useRef(0);
  const streakRef = useRef(0);

  useEffect(() => {
    if (bpm === 90) {
      unlockAchievement('on_the_beat');
    }
  }, [bpm, unlockAchievement]);

  const handleTap = useCallback(() => {
    const now = performance.now();

    if (lastTapTime.current === 0) {
      lastTapTime.current = now;
      setTaps([]);
      setBpm(0);
      streakRef.current = 0;
      prevBpmRef.current = 0;
      return;
    }

    const diff = now - lastTapTime.current;
    lastTapTime.current = now;

    if (diff > 2000) {
      setTaps([]);
      setBpm(0);
      streakRef.current = 0;
      prevBpmRef.current = 0;
      return;
    }

    setTaps((prev) => {
      const newTaps = [...prev, diff];
      if (newTaps.length > 8) newTaps.shift();

      const averageDiff = newTaps.reduce((a, b) => a + b, 0) / newTaps.length;
      const calculatedBpm = Math.round(60000 / averageDiff);

      if (newTaps.length > 3) {
        if (calculatedBpm === prevBpmRef.current) {
          streakRef.current += 1;
          if (streakRef.current >= 15) unlockAchievement('human_metronome');
        } else {
          streakRef.current = 0;
        }
      }
      prevBpmRef.current = calculatedBpm;
      setBpm(calculatedBpm);
      return newTaps;
    });
  }, [unlockAchievement]);

  const reset = () => {
    setTaps([]);
    setBpm(0);
    lastTapTime.current = 0;
    streakRef.current = 0;
    prevBpmRef.current = 0;
  };

  // Space is the natural key for a tap-tempo tool.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable)
        return;
      e.preventDefault();
      handleTap();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleTap]);

  const ticking = bpm >= 30 && bpm <= 260;
  // one full left-right-left cycle covers two beats
  const period = ticking ? 120 / bpm : 1;

  // the weight rides high for slow tempi, low for fast — as on the real scale
  const weightPct = (() => {
    const clamped = Math.min(208, Math.max(40, bpm || 40));
    const t =
      (Math.log(clamped) - Math.log(40)) / (Math.log(208) - Math.log(40));
    return 8 + t * 84; // % up the rod, inverted below — matches the scale span
  })();

  return (
    <div className="met">
      <style>{CSS}</style>
      <Seo
        title="BPM Guesser | Fezcodex"
        description="Find the tempo of any song by tapping along to the beat."
        keywords={[
          'Fezcodex',
          'BPM counter',
          'tap tempo',
          'music tools',
          'metronome',
        ]}
      />

      <div className="met__shell">
        <Link to="/apps" className="met__back">
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

        <h1 className="met__title">BPM guesser</h1>
        <p className="met__sub">
          Tap along to a song and the weight slides to its tempo. Four taps is
          enough for a reading; keep going and it settles.
        </p>

        <div className="met__stage">
          <div className="met__case">
            <div className="met__slot">
              <div className="met__scale" aria-hidden="true">
                {SCALE.map((n) => (
                  <div className="met__tick" key={n}>
                    <i />
                    {n}
                  </div>
                ))}
              </div>

              <div
                className={`met__rod-pivot${ticking ? ' met__rod-pivot--ticking' : ''}`}
                style={{ '--period': `${period}s` }}
              >
                <div className="met__rod">
                  <div
                    className="met__weight"
                    style={{ bottom: `${100 - weightPct}%` }}
                  />
                </div>
                <div className="met__bob" />
              </div>
            </div>

            <div className="met__plaque">
              <div className="met__bpm">
                {bpm > 0 ? bpm : '—'} <span>bpm</span>
              </div>
              <div className="met__mark">
                {bpm > 0 ? markFor(bpm) : 'waiting for a beat'}
              </div>
            </div>
          </div>
        </div>

        <div className="met__controls">
          <button className="met__tap" onMouseDown={handleTap}>
            Tap
          </button>
          <p className="met__hint">
            or press <kbd>space</kbd>
          </p>
        </div>

        <div className="met__meta">
          <span>
            Taps counted <b>{taps.length}</b>
          </span>
          <button className="met__reset" onClick={reset}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
};

export default BpmGuesserPage;
