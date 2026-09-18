import React, { useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import {
  RAZORS,
  RAZOR_CASES,
  razorDissent,
  razorTally,
  razorVerdicts,
} from './models';

export default function RazorExperiment({ case: caseId, embedded = true }) {
  const index = RAZOR_CASES.findIndex((entry) => entry.id === caseId);
  const start = index === -1 ? 0 : index;
  return <Drawer key={start} start={start} embedded={embedded} />;
}

function Drawer({ start, embedded }) {
  // Start wherever the post dropped the reader in, then wrap through the rest.
  const order = [...RAZOR_CASES.slice(start), ...RAZOR_CASES.slice(0, start)];
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(false);

  const entry = order[step];
  const options = razorVerdicts(entry.id);
  const result = chosen ? razorDissent(entry.id, chosen) : null;
  const last = step + 1 === order.length;

  const choose = (razorId) => {
    setChosen(razorId);
    setPicks([...picks, { caseId: entry.id, razorId }]);
  };
  const advance = () => {
    if (last) return setDone(true);
    setStep(step + 1);
    setChosen(null);
  };
  const reset = () => {
    setStep(0);
    setPicks([]);
    setChosen(null);
    setDone(false);
  };

  return (
    <ExperimentFrame
      id="razor-drawer"
      embedded={embedded}
      settings={{ case: entry.id }}
    >
      {done ? (
        <Tally picks={picks} onReset={reset} />
      ) : (
        <>
          <p className="pc-label">
            Case {String(step + 1).padStart(2, '0')} of{' '}
            {String(order.length).padStart(2, '0')} · {entry.title}
          </p>
          <div className="pc-explanation">
            <p>{entry.scene}</p>
          </div>
          {!chosen && (
            <>
              <p className="pc-status">
                Which razor do you reach for? Every one of these is quoted with
                a straight face by someone, somewhere, about facts like these.
              </p>
              <div className="pc-collection" aria-label="Choose a razor">
                {options.map((razor) => (
                  <button
                    key={razor.id}
                    type="button"
                    onClick={() => choose(razor.id)}
                  >
                    <span className="pc-label">Razor</span>
                    <strong>{razor.name}</strong>
                    <span>{razor.rule}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {result && <Verdict entry={entry} result={result} />}
          {chosen && (
            <div className="pc-actions">
              <button className="pc-primary" onClick={advance}>
                {last ? 'See what that says about you' : 'Next case →'}
              </button>
            </div>
          )}
        </>
      )}
      <button
        className="pc-text-button"
        aria-expanded={reveal}
        onClick={() => setReveal((open) => !open)}
      >
        {reveal ? 'Close' : 'Open'} the whole drawer
      </button>
      {reveal && (
        <div className="pc-explanation">
          <div className="pc-table-wrap">
            <table className="pc-table">
              <caption>Every razor in the drawer</caption>
              <thead>
                <tr>
                  <th>Razor</th>
                  <th>What it actually says</th>
                </tr>
              </thead>
              <tbody>
                {RAZORS.map((razor) => (
                  <tr key={razor.id}>
                    <td>{razor.name}</td>
                    <td>{razor.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pc-note">
            None of these is a proof. Every one is a rule for deciding what to
            look at first when the evidence has run out.
          </p>
        </div>
      )}
    </ExperimentFrame>
  );
}

function Verdict({ entry, result }) {
  const { picked, agrees, dissents, abstains } = result;
  const misapplied = picked.stance === 'abstain';
  return (
    <>
      <div className="pc-explanation" aria-live="polite">
        <p>
          <strong>
            {picked.name}: {picked.call}.
          </strong>{' '}
          {picked.why}
        </p>
        {misapplied && (
          <p>
            That razor has no jurisdiction over these facts. Reaching for it
            here is not reasoning, it is a costume.
          </p>
        )}
      </div>
      {!!agrees.length && (
        <>
          <p className="pc-label">Agrees with you</p>
          <div className="pc-explanation">
            {agrees.map((razor) => (
              <p key={razor.id}>
                <strong>{razor.name}.</strong> {razor.why}
              </p>
            ))}
          </div>
        </>
      )}
      {!!dissents.length && (
        <>
          <p className="pc-label">
            Reaches the opposite conclusion · same facts
          </p>
          <div className="pc-explanation">
            {dissents.map((razor) => (
              <p key={razor.id}>
                <strong>
                  {razor.name}: {razor.call}.
                </strong>{' '}
                {razor.why}
              </p>
            ))}
          </div>
        </>
      )}
      {!!abstains.length && (
        <>
          <p className="pc-label">No jurisdiction here</p>
          <div className="pc-explanation">
            {abstains.map((razor) => (
              <p key={razor.id}>
                <strong>{razor.name}.</strong> {razor.why}
              </p>
            ))}
          </div>
        </>
      )}
      <p className="pc-note">
        <strong>What would actually settle it:</strong> {entry.settles}
      </p>
    </>
  );
}

function Tally({ picks, onReset }) {
  const tally = razorTally(picks);
  return (
    <>
      <p className="pc-label">The drawer, closed</p>
      <div className="pc-explanation" aria-live="polite">
        <p>
          You reached for <strong>{tally.favourite.name}</strong> in{' '}
          {tally.favouriteCount} of {tally.total} cases, and used{' '}
          {tally.distinct} {tally.distinct === 1 ? 'razor' : 'razors'} in total.
        </p>
        <p>
          In <strong>{tally.contested}</strong> of {tally.total}, a razor you
          did not pick reached the opposite conclusion from exactly the same
          facts. Neither of you looked at any new evidence in between.
        </p>
        {tally.misapplied > 0 && (
          <p>
            {tally.misapplied}{' '}
            {tally.misapplied === 1 ? 'time you used' : 'times you used'} a
            razor with no jurisdiction over the facts at all.
          </p>
        )}
      </div>
      <div className="pc-table-wrap">
        <table className="pc-table">
          <caption>Your cuts</caption>
          <thead>
            <tr>
              <th>Case</th>
              <th>Your razor</th>
              <th>Disagreed with you</th>
            </tr>
          </thead>
          <tbody>
            {picks.map(({ caseId, razorId }) => {
              const { picked, dissents } = razorDissent(caseId, razorId);
              const entry = RAZOR_CASES.find((item) => item.id === caseId);
              return (
                <tr key={caseId}>
                  <td>{entry.title}</td>
                  <td>{picked.name}</td>
                  <td>
                    {dissents.length
                      ? dissents.map((razor) => razor.name).join(', ')
                      : 'Nothing in the drawer'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="pc-note">
        The razors are not scored against a right answer, because on these facts
        there is not one yet. That is the whole point: a razor tells you where
        to look first, and then you are supposed to go and look.
      </p>
      <div className="pc-actions">
        <button className="pc-primary" onClick={onReset}>
          Open the drawer again
        </button>
      </div>
    </>
  );
}
