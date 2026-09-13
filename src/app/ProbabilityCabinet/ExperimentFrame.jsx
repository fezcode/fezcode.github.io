import React from 'react';
import { Link } from 'react-router-dom';
import experiments from './experiments.json';

export default function ExperimentFrame({
  id,
  embedded = true,
  settings = {},
  children,
}) {
  const entry = experiments.find((item) => item.id === id);
  const query = new URLSearchParams({ experiment: id, ...settings });
  return (
    <section
      className={`probability-experiment not-prose ${embedded ? 'pc-embedded' : ''}`}
      aria-label={`${entry.title} experiment`}
    >
      <div className="pc-caption">
        <span>
          Experiment {String(experiments.indexOf(entry) + 1).padStart(2, '0')}
        </span>
        <span>
          {entry.kind} ·{' '}
          {id === 'pirate-game' ? 'Strategic model' : 'Deterministic model'}
        </span>
      </div>
      <h2>{entry.title}</h2>
      <p className="pc-intro">{entry.description}</p>
      {children}
      <footer className="pc-footer">
        {embedded ? (
          <Link to={`/apps/probability-cabinet?${query}`}>
            Open in Probability Cabinet ↗
          </Link>
        ) : (
          <Link to={`/blog/${entry.post}`}>
            Read the story behind the experiment ↗
          </Link>
        )}
        <span>Change the inputs. Inspect the reasoning.</span>
      </footer>
    </section>
  );
}
