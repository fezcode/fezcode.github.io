import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import ProbabilityExperiment from '../../app/ProbabilityCabinet/ProbabilityExperiment';
import experiments from '../../app/ProbabilityCabinet/experiments.json';

export default function ProbabilityCabinetPage() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('experiment') || 'penneys-game';
  const entry = experiments.find((item) => item.id === selected);
  const settings = Object.fromEntries(
    (entry?.attributes || [])
      .filter((name) => params.has(name))
      .map((name) => [name, params.get(name)]),
  );
  return (
    <main className="probability-cabinet">
      <Seo
        title="Probability Cabinet | Fezcodex"
        description="Interactive experiments in probability, game theory, statistics, number patterns, social psychology, and epistemics. Flip coins, bargain with pirates, weight movie ratings, explore 6174, sit at Milgram’s shock generator, and watch philosophical razors contradict each other."
      />
      <div className="pc-shell">
        <nav className="pc-nav">
          <Link to="/apps">← App collection</Link>
          <span>Fezcodex / Laboratory of chance</span>
        </nav>
        <header className="pc-hero">
          <p className="pc-eyebrow">An instrument for questioning intuition</p>
          <h1>
            Probability
            <br />
            Cabinet.
          </h1>
          <p>
            Small experiments in chance, strategy, and number patterns. Make a
            prediction, put it to the test, and inspect the reasoning.
          </p>
        </header>
        <nav className="pc-collection" aria-label="Choose an experiment">
          {experiments.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected === item.id}
              onClick={() => setParams({ experiment: item.id })}
            >
              <span className="pc-label">{item.kind}</span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </nav>
        <ProbabilityExperiment
          key={selected}
          experiment={selected}
          {...settings}
          embedded={false}
        />
      </div>
    </main>
  );
}
