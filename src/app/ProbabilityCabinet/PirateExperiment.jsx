import React, { useState } from 'react';
import CustomDropdown from '../../components/CustomDropdown';
import ExperimentFrame from './ExperimentFrame';
import {
  boundedNumber,
  pirateSolution,
  pirateVote,
  votesNeeded,
} from './models';

const equalSplit = (count) => Array(count - 1).fill(Math.floor(100 / count));

export default function PirateExperiment({ pirates, rule, embedded = true }) {
  const count = boundedNumber(pirates, 5, 1, 5, true);
  const votingRule = rule === 'majority' ? rule : 'half';
  return (
    <PirateCouncil
      key={`${count}-${votingRule}`}
      initialCount={count}
      initialRule={votingRule}
      embedded={embedded}
    />
  );
}

function PirateCouncil({ initialCount, initialRule, embedded }) {
  const [count, setCount] = useState(initialCount);
  const [rule, setRule] = useState(initialRule);
  const [offers, setOffers] = useState(() => equalSplit(initialCount));
  const [result, setResult] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [notice, setNotice] = useState('');
  const total = offers.reduce((sum, n) => sum + n, 0);
  const allocation = [100 - total, ...offers];
  const names = 'ABCDE'.slice(5 - count).split('');
  const solution = pirateSolution(count, rule);
  const reset = (nextCount = count, nextRule = rule) => {
    setCount(nextCount);
    setRule(nextRule);
    setOffers(equalSplit(nextCount));
    setResult(null);
    setReveal(false);
    setNotice('');
  };
  const vote = () => {
    setResult(pirateVote(allocation, rule));
    setNotice('');
  };
  return (
    <ExperimentFrame
      id="pirate-game"
      embedded={embedded}
      settings={{ pirates: count, rule }}
    >
      <div className="pc-fields">
        <div>
          <span className="pc-label">Pirates aboard</span>
          <CustomDropdown
            variant="paper"
            fullWidth
            value={count}
            options={[1, 2, 3, 4, 5].map((n) => ({
              value: n,
              label: `${n} pirate${n === 1 ? '' : 's'}`,
            }))}
            onChange={(n) => reset(n)}
          />
        </div>
        <div>
          <span className="pc-label">Passing a proposal</span>
          <CustomDropdown
            variant="paper"
            fullWidth
            value={rule}
            options={[
              { value: 'half', label: 'At least half · ties pass' },
              { value: 'majority', label: 'Strict majority · ties fail' },
            ]}
            onChange={(v) => reset(count, v)}
          />
        </div>
      </div>
      <p className="pc-note">
        Seniority: A → E. Captain {names[0]} votes too:{' '}
        {votesNeeded(count, rule)} yes vote(s) needed. Everyone prioritizes
        survival, then coins, then rejecting the captain if both outcomes are
        equal. All pirates know these rules.
      </p>
      <div className="pc-pirates">
        {names.map((name, i) => (
          <div
            className={`pc-pirate ${i === 0 ? 'pc-captain' : ''}`}
            key={name}
          >
            <span className="pc-label">
              {i === 0 ? 'Captain' : 'Pirate'} {name}
            </span>
            {i === 0 ? (
              <strong className="pc-treasure">{allocation[0]}</strong>
            ) : (
              <label className="pc-coin-input">
                <span className="sr-only">Coins for pirate {name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={offers[i - 1]}
                  onChange={(e) => {
                    const value = boundedNumber(
                      e.target.value,
                      0,
                      0,
                      100,
                      true,
                    );
                    setOffers((old) =>
                      old.map((n, j) => (j === i - 1 ? value : n)),
                    );
                    setResult(null);
                    setNotice('');
                  }}
                />
              </label>
            )}
            <span className="pc-note">
              {i === 0 ? 'coins left to keep' : 'coins offered'}
            </span>
            {result?.valid && (
              <span className={result.votes[i] ? 'pc-vote-yes' : 'pc-vote-no'}>
                {result.votes[i] ? 'YES' : 'NO'}
              </span>
            )}
          </div>
        ))}
      </div>
      {total > 100 && (
        <p role="alert">
          You offered {total - 100} coins more than the chest contains. Reduce
          the crew’s offers.
        </p>
      )}
      <div className="pc-actions">
        <button className="pc-primary" disabled={total > 100} onClick={vote}>
          Put it to a vote
        </button>
        <button
          onClick={() => {
            setOffers(equalSplit(count));
            setResult(null);
            setNotice('');
          }}
        >
          Equal split
        </button>
        <button onClick={() => reset()}>Reset</button>
      </div>
      <div aria-live="polite" className="pc-explanation">
        {notice && <p>{notice}</p>}
        {result?.valid && (
          <>
            <p>
              <strong>
                {result.accepted ? 'Proposal accepted.' : 'Proposal rejected.'}
              </strong>{' '}
              {result.votes.filter(Boolean).length} of {count} pirates voted
              yes.{' '}
              {result.accepted
                ? `Captain ${names[0]} keeps ${allocation[0]} coins.`
                : `Captain ${names[0]} goes overboard; the next pirate gets to propose.`}
            </p>
            {!result.accepted && count > 1 && (
              <button
                className="pc-text-button"
                onClick={() => {
                  reset(count - 1);
                  setNotice(
                    `Captain ${names[0]} is gone. ${names[1]} now proposes a split of the same 100 coins.`,
                  );
                }}
              >
                Continue with captain {names[1]} →
              </button>
            )}
            <ul>
              {names.slice(1).map((name, i) => (
                <li key={name}>
                  {name}: offered {offers[i]}; if the captain is rejected,{' '}
                  {result.fallback[i] === null
                    ? 'would not survive'
                    : `expects ${result.fallback[i]} coins`}
                  . Votes {result.votes[i + 1] ? 'yes' : 'no'}.
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button
        className="pc-text-button"
        aria-expanded={reveal}
        onClick={() => setReveal((v) => !v)}
      >
        {reveal ? 'Hide' : 'Reveal'} the backward-induction solution
      </button>
      {reveal && (
        <div className="pc-explanation">
          <p>
            Start with the last pirate. At every earlier vote, buy the cheapest
            votes by improving on what those pirates expect after rejecting the
            captain. A pirate who would die next accepts even zero coins to
            survive.
          </p>
          <div className="pc-table-wrap">
            <table className="pc-table">
              <caption>Optimal proposals, working backward from E</caption>
              <thead>
                <tr>
                  <th>Pirates left</th>
                  <th>Allocation in seniority order</th>
                  <th>Yes votes needed</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
                  <tr key={n}>
                    <td>
                      {'ABCDE'
                        .slice(5 - n)
                        .split('')
                        .join(', ')}
                    </td>
                    <td>
                      {pirateSolution(n, rule)
                        .map((v) => (v === null ? 'overboard' : v))
                        .join(' / ')}
                    </td>
                    <td>{votesNeeded(n, rule)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {solution[0] === null ? (
            <p>
              This captain cannot secure enough votes, even by giving away every
              coin.
            </p>
          ) : (
            <button
              className="pc-text-button"
              onClick={() => {
                setOffers(solution.slice(1));
                setResult(null);
                setNotice(
                  'Optimal offer loaded. Put it to a vote to inspect each decision.',
                );
              }}
            >
              Load optimal offer ({solution.join(', ')})
            </button>
          )}
          <p>
            The classic five-pirate result is 98, 0, 1, 0, 1 when ties pass.
            Requiring a strict majority changes the later rounds and therefore
            today’s bargaining power. Where several cheapest coalitions tie,
            this walkthrough chooses the more senior eligible pirate first.
          </p>
        </div>
      )}
    </ExperimentFrame>
  );
}
