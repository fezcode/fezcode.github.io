import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../../components/CustomDropdown';
import {
  advanceGame,
  bestResponse,
  emptyGame,
  normalizePair,
  secondWinProbability,
  sequences,
  simulateGames,
} from './penney';
import './probability.css';

const percent = (n) => `${(n * 100).toFixed(1)}%`;

export default function PenneyCard({
  experiment = 'penneys-game',
  first = 'HHT',
  second = 'THH',
  embedded = true,
}) {
  const [a, b] = normalizePair(first, second);
  if (experiment !== 'penneys-game') {
    return (
      <p>
        Experiment unavailable.{' '}
        <Link to="/apps/probability-cabinet">
          Explore the Probability Cabinet
        </Link>
        .
      </p>
    );
  }
  return (
    <PenneyExperiment
      key={`${a}-${b}`}
      initialFirst={a}
      initialSecond={b}
      embedded={embedded}
    />
  );
}

function PenneyExperiment({ initialFirst, initialSecond, embedded }) {
  const [first, setFirst] = useState(initialFirst);
  const [second, setSecond] = useState(initialSecond);
  const [game, setGame] = useState(emptyGame);
  const [wins, setWins] = useState({ first: 0, second: 0 });
  const [running, setRunning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const total = wins.first + wins.second;
  const theory = secondWinProbability(first, second);
  const observed = total ? wins.second / total : null;
  const href = `/apps/probability-cabinet?experiment=penneys-game&first=${first}&second=${second}`;

  const reset = () => {
    clearTimeout(timer.current);
    setRunning(false);
    setGame(emptyGame());
    setWins({ first: 0, second: 0 });
  };
  const choose = (player, value) => {
    reset();
    if (player === 1) {
      setFirst(value);
      if (value === second) setSecond(bestResponse(value));
    } else setSecond(value);
  };
  const flip = () => {
    const next = advanceGame(
      game.winner ? emptyGame() : game,
      first,
      second,
      Math.random() < 0.5 ? 'H' : 'T',
    );
    setGame(next);
    if (next.winner)
      setWins((old) => ({
        ...old,
        [next.winner === 1 ? 'first' : 'second']:
          old[next.winner === 1 ? 'first' : 'second'] + 1,
      }));
  };
  const batch = () => {
    // Start a fresh game; unfinished manual flips are not counted as a trial.
    setGame(emptyGame());
    setRunning(true);
    let remaining = 1000;
    const step = () => {
      const result = simulateGames(first, second, 100);
      setWins((old) => ({
        first: old.first + result.first,
        second: old.second + result.second,
      }));
      remaining -= 100;
      if (remaining) timer.current = setTimeout(step, 30);
      else setRunning(false);
    };
    timer.current = setTimeout(step, 0);
  };

  return (
    <section
      className={`probability-experiment not-prose ${embedded ? 'pc-embedded' : ''}`}
      aria-label="Penney's Game experiment"
    >
      <div className="pc-caption">
        <span>Experiment 01 / A fair coin, an unfair race</span>
        <span>H = heads · T = tails</span>
      </div>
      <h2>Penney’s Game</h2>
      <p className="pc-intro">
        Two patterns. One coin. Which sequence will appear first?
      </p>
      <div className="pc-players">
        {[
          { player: 1, value: first, name: 'Player 1', options: sequences },
          {
            player: 2,
            value: second,
            name: 'Player 2',
            options: sequences.filter((s) => s !== first),
          },
        ].map(({ player, value, name, options }) => (
          <div className={`pc-player pc-player-${player}`} key={player}>
            <span className="pc-label">{name}</span>
            <div className="pc-pattern" aria-label={`${name}: ${value}`}>
              {value.split('').map((coin, i) => (
                <span key={i}>{coin}</span>
              ))}
            </div>
            <CustomDropdown
              label={`${name} sequence`}
              variant="paper"
              fullWidth
              options={options.map((s) => ({ value: s, label: s }))}
              value={value}
              onChange={(v) => choose(player, v)}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="pc-text-button"
        onClick={() => {
          choose(2, bestResponse(first));
          setShowExplanation(true);
        }}
      >
        Choose the best response for Player 2 ↗
      </button>
      <div className="pc-stream" aria-label="Recent coin flips">
        <div className="pc-caption">
          <span>The coin trail</span>
          <span>{game.flips} flips · last 24 shown</span>
        </div>
        <div className="pc-coins">
          {game.history.length ? (
            game.history.map((coin, i) => (
              <span
                className={
                  game.winner && i >= game.history.length - 3
                    ? 'pc-winning'
                    : ''
                }
                key={`${game.flips}-${i}`}
              >
                {coin}
              </span>
            ))
          ) : (
            <p>Make a prediction, then flip the coin.</p>
          )}
        </div>
        <p className="pc-status" aria-live="polite">
          {game.winner
            ? `Player ${game.winner} wins this game. Flip again to start another.`
            : running
              ? 'Running 1,000 fresh games…'
              : game.flips
                ? 'Keep flipping until one pattern appears.'
                : 'Every game ends at the first matching pattern.'}
        </p>
      </div>
      <div className="pc-actions">
        <button
          type="button"
          className="pc-primary"
          disabled={running}
          onClick={flip}
        >
          Flip once
        </button>
        <button type="button" disabled={running} onClick={batch}>
          Run 1,000 games
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
      <p className="pc-note">
        Batch runs start fresh. Changing either sequence resets the results.
      </p>
      <div className="pc-results">
        <div className="pc-caption">
          <span>The evidence</span>
          <span>{total.toLocaleString()} completed games</span>
        </div>
        <div className="pc-result-label">
          <span>Observed · Player 2</span>
          <strong>
            {observed === null ? 'No trials yet' : percent(observed)}
          </strong>
        </div>
        <div
          className="pc-bar"
          role="img"
          aria-label={
            observed === null
              ? 'No observed results yet'
              : `Observed Player 2 win rate: ${percent(observed)}`
          }
        >
          <span style={{ width: `${(observed ?? 0) * 100}%` }} />
        </div>
        <div className="pc-result-label">
          <span>Theoretical · Player 2</span>
          <strong>{percent(theory)}</strong>
        </div>
        <div
          className="pc-bar pc-theory"
          role="img"
          aria-label={`Theoretical Player 2 win rate: ${percent(theory)}`}
        >
          <span style={{ width: `${theory * 100}%` }} />
        </div>
        <p className="pc-note">
          Player 1: {wins.first.toLocaleString()} wins · Player 2:{' '}
          {wins.second.toLocaleString()} wins. Simulations fluctuate; theory
          describes the long-run probability.
        </p>
      </div>
      <button
        type="button"
        className="pc-text-button"
        aria-expanded={showExplanation}
        onClick={() => setShowExplanation((v) => !v)}
      >
        {showExplanation ? 'Hide' : 'Reveal'} the explanation{' '}
        {showExplanation ? '−' : '+'}
      </button>
      {showExplanation && (
        <div className="pc-explanation">
          <p>
            Each three-flip pattern has the same chance in an isolated block of
            three tosses. Here, the windows overlap and the race stops at the
            first match. That changes the odds.
          </p>
          <p>
            For {first}, a best response is {bestResponse(first)}: flip the
            middle letter, then append the first two. Choosing second gives an
            advantage when you choose a best response—it never guarantees a win.
          </p>
          <p>
            For the current pairing, Player 2 wins with probability{' '}
            {percent(theory)}. The calculation tracks partial matches to both
            patterns, including overlaps.
          </p>
        </div>
      )}
      <footer className="pc-footer">
        {embedded ? (
          <Link to={href}>Open in Probability Cabinet ↗</Link>
        ) : (
          <Link to="/blog/penneys-game">
            Read the story behind the experiment ↗
          </Link>
        )}
        <span>Fair coin · Independent flips</span>
      </footer>
    </section>
  );
}
