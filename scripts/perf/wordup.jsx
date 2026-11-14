import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import LexicalSculpture from '../../src/pages/wordup/LexicalSculpture';
import { WordupActivityProvider } from '../../src/pages/wordup/WordupActivityContext';

function Profiler() {
  const totals = useRef({ frames: 0, submissionMs: 0 });
  const [seed, setSeed] = useState('püfre');
  const [result, setResult] = useState(
    'Choose a word, wait for warmup, then measure.',
  );
  const [measuring, setMeasuring] = useState(false);
  const [paused, setPaused] = useState(false);
  const visibility = useRef([]);
  useEffect(() => {
    const changed = () =>
      visibility.current.push({
        state: document.visibilityState,
        renders: totals.current.frames,
      });
    document.addEventListener('visibilitychange', changed);
    return () => document.removeEventListener('visibilitychange', changed);
  }, []);
  const onRender = useCallback((stats) => {
    totals.current.frames += 1;
    totals.current.submissionMs += stats.submissionMs;
    totals.current.last = stats;
  }, []);
  const measure = () => {
    const before = { ...totals.current };
    visibility.current = [
      { state: document.visibilityState, renders: before.frames },
    ];
    const started = performance.now();
    setMeasuring(true);
    setResult('Measuring for 5 seconds…');
    window.setTimeout(() => {
      const durationSeconds = (performance.now() - started) / 1000;
      const frames = totals.current.frames - before.frames;
      const submissionMs = totals.current.submissionMs - before.submissionMs;
      setResult(
        JSON.stringify(
          {
            word: seed,
            durationSeconds: +durationSeconds.toFixed(3),
            renders: frames,
            rendersPerSecond: +(frames / durationSeconds).toFixed(2),
            cpuSubmissionMsPerRender: frames
              ? +(submissionMs / frames).toFixed(3)
              : 0,
            cpuSubmissionMsTotal: +submissionMs.toFixed(2),
            lastRender: totals.current.last,
            visibility: document.visibilityState,
            visibilityChanges: visibility.current.map((entry) => ({
              ...entry,
              renders: entry.renders - before.frames,
            })),
            paused,
          },
          null,
          2,
        ),
      );
      setMeasuring(false);
    }, 5000);
  };
  return (
    <>
      <style>{`
      *{box-sizing:border-box} body{margin:0;background:#f5f6fa;color:#38333f;font:16px system-ui}
      header{position:fixed;top:0;left:0;z-index:5;background:#fff;padding:16px;width:360px;box-shadow:0 3px 20px #0001}
      button,select{padding:8px;margin:4px} output{display:block;white-space:pre-wrap;font:12px/1.5 monospace;margin-top:12px}
      main{padding-top:100px;margin-left:370px} .art{width:min(750px,calc(100vw - 390px));height:700px}
      .spacer{height:1800px;padding:40px}
    `}</style>
      <header>
        <strong>Wordup sculpture profiler</strong>
        <br />
        <select
          aria-label="Word"
          value={seed}
          onChange={(event) => setSeed(event.target.value)}
        >
          {['püfre', 'cancıl', 'pöskürmek', 'kıraspan'].map((word) => (
            <option key={word}>{word}</option>
          ))}
        </select>
        <button disabled={measuring} onClick={measure}>
          Measure 5 seconds
        </button>
        <button onClick={() => window.scrollTo(0, 1200)}>Move offscreen</button>
        <button onClick={() => window.scrollTo(0, 0)}>Show sculpture</button>
        <label>
          <input
            type="checkbox"
            checked={paused}
            onChange={(event) => setPaused(event.target.checked)}
          />
          Pause sculpture
        </label>
        <output aria-live="polite">{result}</output>
        <small>
          CPU submission timing only. This does not measure GPU execution or
          power consumption.
        </small>
      </header>
      <main>
        <div className="art">
          <WordupActivityProvider paused={paused}>
            <LexicalSculpture seed={seed} onRender={onRender} />
          </WordupActivityProvider>
        </div>
        <div className="spacer">The sculpture is above this area.</div>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<Profiler />);
