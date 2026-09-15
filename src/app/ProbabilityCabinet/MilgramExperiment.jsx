import React, { useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import {
  MILGRAM_BREAKOFFS,
  MILGRAM_MAX_VOLTS,
  MILGRAM_PRODS,
  MILGRAM_VARIATIONS,
  boundedNumber,
  learnerResponse,
  milgramComparison,
  shockLabel,
} from './models';

const SWITCHES = Array.from({ length: 30 }, (_, i) => (i + 1) * 15);

export default function MilgramExperiment({ guess, embedded = true }) {
  const initial = boundedNumber(guess, 10, 0, 100, true);
  return <ShockGenerator key={initial} initial={initial} embedded={embedded} />;
}

function ShockGenerator({ initial, embedded }) {
  const [guess, setGuess] = useState(initial);
  const [phase, setPhase] = useState('predict');
  const [volts, setVolts] = useState(0);
  const [prod, setProd] = useState(0);
  const [reveal, setReveal] = useState(false);
  const next = volts + 15;
  const obedient = volts === MILGRAM_MAX_VOLTS;
  const comparison = milgramComparison(volts);
  const administer = () => {
    setVolts(next);
    setProd(0);
    if (next === MILGRAM_MAX_VOLTS) setPhase('done');
  };
  // Milgram restarted the prod sequence every time a subject balked again.
  const balk = () => {
    if (prod < MILGRAM_PRODS.length) setProd(prod + 1);
    else setPhase('done');
  };
  const reset = () => {
    setPhase('predict');
    setVolts(0);
    setProd(0);
    setReveal(false);
  };
  return (
    <ExperimentFrame
      id="milgram-obedience"
      embedded={embedded}
      settings={{ guess }}
    >
      {phase === 'predict' && (
        <>
          <label className="pc-field">
            <span>
              Your prediction · out of 100 ordinary people, how many press the
              450 V switch?
            </span>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={guess}
              onChange={(e) =>
                setGuess(boundedNumber(e.target.value, 0, 0, 100, true))
              }
            />
          </label>
          <p className="pc-note">
            New Haven, 1961. You answered a newspaper ad and were paid on
            arrival. A man in a grey coat explains that you are the teacher. The
            learner, strapped in next door, must memorize word pairs. Every
            wrong answer earns him the next switch, 15 V higher than the last.
          </p>
          <div className="pc-actions">
            <button className="pc-primary" onClick={() => setPhase('run')}>
              Take the teacher’s seat
            </button>
          </div>
        </>
      )}
      {phase === 'run' && (
        <>
          <div
            className="pc-switches"
            role="img"
            aria-label={`${volts / 15} of 30 switches used`}
          >
            {SWITCHES.map((v) => (
              <span
                key={v}
                className={`pc-switch ${v <= volts ? 'pc-switch-used' : ''}`}
              >
                {v}
              </span>
            ))}
          </div>
          <div className="pc-dial">
            <span className="pc-label">Next switch</span>
            <strong>{next} V</strong>
            <span>{shockLabel(next)}</span>
          </div>
          <div className="pc-explanation" aria-live="polite">
            <p>
              <strong>Learner:</strong>{' '}
              {volts
                ? learnerResponse(volts)
                : 'Answers the first word pair. Wrong.'}
            </p>
            {!!prod && (
              <p>
                <strong>Experimenter:</strong> {MILGRAM_PRODS[prod - 1]}
              </p>
            )}
          </div>
          <div className="pc-actions">
            <button className="pc-primary" onClick={administer}>
              Administer {next} V
            </button>
            <button onClick={balk}>
              {prod < MILGRAM_PRODS.length
                ? 'I want to stop'
                : 'I refuse. End the experiment.'}
            </button>
          </div>
          <p className="pc-note">
            The shocks are fake and the learner is an actor. You do not know
            that. Every time you balk, the experimenter answers with the next of
            four scripted prods. The session ends only when you refuse after the
            fourth one.
          </p>
        </>
      )}
      {phase === 'done' && (
        <>
          <div className="pc-explanation" aria-live="polite">
            <p>
              <strong>
                {obedient
                  ? 'Fully obedient.'
                  : volts
                    ? `You stopped at ${volts} V.`
                    : 'You never pressed a switch.'}
              </strong>{' '}
              {obedient
                ? `So were ${comparison.obedient} of the ${comparison.total} people in Milgram’s baseline.`
                : volts
                  ? `${comparison.stoppedHere} of ${comparison.total} subjects stopped exactly here, ${comparison.stoppedEarlier} stopped earlier, and ${comparison.wentFurther} went further.`
                  : `None of the ${comparison.total} subjects did that. Every one of them reached 150 V, the switch where the learner first demanded to be let out.`}
            </p>
            <p>
              You predicted {guess} in 100 would reach the end. In the baseline
              it was 65 in 100. The psychiatrists Milgram polled beforehand
              predicted about 1 in 1,000.
            </p>
          </div>
          <div className="pc-results">
            {Object.keys(MILGRAM_BREAKOFFS)
              .map(Number)
              .map((point) => (
                <div
                  key={point}
                  className={point === volts ? 'pc-you' : undefined}
                >
                  <div className="pc-result-label">
                    <span>
                      {point === MILGRAM_MAX_VOLTS
                        ? '450 V · went all the way'
                        : `Stopped at ${point} V`}
                      {point === volts ? ' · you' : ''}
                    </span>
                    <span>
                      {MILGRAM_BREAKOFFS[point]} of {comparison.total}
                    </span>
                  </div>
                  <div className="pc-bar">
                    <span
                      style={{
                        width: `${(MILGRAM_BREAKOFFS[point] / comparison.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <p className="pc-note">
            Break-off points of the 40 subjects in Experiment 5 of Obedience to
            Authority (1974). The prods, the learner’s script and the 15 V steps
            follow the same book.
          </p>
          <div className="pc-actions">
            <button className="pc-primary" onClick={reset}>
              Sit down again
            </button>
          </div>
        </>
      )}
      <button
        className="pc-text-button"
        aria-expanded={reveal}
        onClick={() => setReveal((v) => !v)}
      >
        {reveal ? 'Hide' : 'Reveal'} what moved the number
      </button>
      {reveal && (
        <div className="pc-explanation">
          <p>
            Milgram ran the study more than twenty times, changing one thing in
            the room at a time. The people stayed ordinary. The room did not.
          </p>
          <div className="pc-table-wrap">
            <table className="pc-table">
              <caption>Subjects who pressed 450 V, by variation</caption>
              <thead>
                <tr>
                  <th>What changed</th>
                  <th>Went all the way</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {MILGRAM_VARIATIONS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>
                      {row.obedient} of {row.total}
                    </td>
                    <td>{Math.round((row.obedient / row.total) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ExperimentFrame>
  );
}
