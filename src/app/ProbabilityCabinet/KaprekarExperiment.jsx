import React, { useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import { kaprekarTrace } from './models';

export default function KaprekarExperiment({ start, embedded = true }) {
  // HTML's `start` attribute is parsed as a number; restore its four-digit form.
  const candidate =
    typeof start === 'number' &&
    Number.isInteger(start) &&
    start >= 0 &&
    start <= 9999
      ? String(start).padStart(4, '0')
      : start;
  const initial = /^\d{4}$/.test(candidate || '') ? candidate : '3524';
  return (
    <KaprekarMachine key={initial} initial={initial} embedded={embedded} />
  );
}
function KaprekarMachine({ initial, embedded }) {
  const [input, setInput] = useState(initial);
  const [visible, setVisible] = useState(0);
  const valid = /^\d{4}$/.test(input);
  const trace = valid ? kaprekarTrace(input) : [];
  const done = valid && visible >= trace.length;
  const current =
    visible && valid
      ? trace[Math.min(visible, trace.length) - 1].result
      : input;
  return (
    <ExperimentFrame
      id="kaprekars-routine"
      embedded={embedded}
      settings={{ start: valid ? input : initial }}
    >
      <label className="pc-field">
        <span>Starting number · four digits</span>
        <input
          value={input}
          inputMode="numeric"
          maxLength={4}
          onChange={(e) => {
            setInput(e.target.value.replace(/[^0-9]/g, ''));
            setVisible(0);
          }}
        />
      </label>
      {!valid && (
        <p role="alert">
          Enter exactly four digits, including any leading zeros.
        </p>
      )}
      <div
        className="pc-number-display"
        aria-label={`Current number: ${current || 'empty'}`}
      >
        {(current || '----').split('').map((digit, i) => (
          <span key={i}>{digit}</span>
        ))}
      </div>
      <div className="pc-actions">
        <button
          className="pc-primary"
          disabled={!valid || done}
          onClick={() => setVisible((v) => v + 1)}
        >
          Next step
        </button>
        <button
          disabled={!valid || done}
          onClick={() => setVisible(trace.length)}
        >
          Run to fixed point
        </button>
        <button onClick={() => setVisible(0)}>Reset steps</button>
      </div>
      <p className="pc-note">
        Sort the same four digits in both directions, then subtract. Keep
        leading zeros at every step. No randomness is involved.
      </p>
      {!!visible && (
        <div className="pc-table-wrap">
          <table className="pc-table">
            <caption>The subtraction trail</caption>
            <thead>
              <tr>
                <th>Step</th>
                <th>Descending</th>
                <th>Ascending</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              {trace.slice(0, visible).map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{row.descending}</td>
                  <td>− {row.ascending}</td>
                  <td>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p aria-live="polite">
        {done
          ? current === '6174'
            ? 'Fixed point reached: 7641 − 1467 = 6174. Further steps stay here.'
            : 'All-identical digits collapse to 0000, which stays at 0000. This is the excluded case in the usual 6174 claim.'
          : visible
            ? `After ${visible} step(s): ${current}. Keep going to check whether it repeats.`
            : 'Try 3524, 1000, or 1111 and compare their paths.'}
      </p>
    </ExperimentFrame>
  );
}
