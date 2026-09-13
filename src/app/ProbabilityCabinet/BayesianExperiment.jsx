import React, { useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import { boundedNumber, bayesianRating } from './models';

export default function BayesianExperiment({
  rating,
  votes,
  prior,
  weight,
  embedded = true,
}) {
  const initial = {
    rating: boundedNumber(rating, 9, 1, 10),
    votes: boundedNumber(votes, 105, 0, 1000000, true),
    prior: boundedNumber(prior, 6.5, 1, 10),
    weight: boundedNumber(weight, 100, 1, 1000000, true),
  };
  return (
    <RatingsLab
      key={JSON.stringify(initial)}
      initial={initial}
      embedded={embedded}
    />
  );
}
function RatingsLab({ initial, embedded }) {
  const [values, setValues] = useState(initial);
  const [explain, setExplain] = useState(false);
  const { rating, votes, prior, weight } = values;
  const score = bayesianRating(rating, votes, prior, weight);
  const reference = bayesianRating(8.2, 500000, prior, weight);
  const contribution = votes / (votes + weight);
  const fields = [
    { key: 'rating', label: 'Film A · raw mean R', min: 1, max: 10, step: 0.1 },
    { key: 'votes', label: 'Film A · votes v', min: 0, max: 1000000, step: 1 },
    { key: 'prior', label: 'Shared prior mean C', min: 1, max: 10, step: 0.1 },
    { key: 'weight', label: 'Prior weight m', min: 1, max: 1000000, step: 1 },
  ];
  return (
    <ExperimentFrame
      id="bayesian-ratings"
      embedded={embedded}
      settings={values}
    >
      <p className="pc-note">
        Illustrative films, not live IMDb data. Film B stays at a raw mean of
        8.2 from 500,000 votes; both films use the same prior. This is the
        article’s weighted-average model, not a reconstruction of IMDb’s
        undisclosed title-rating algorithm.
      </p>
      <div className="pc-fields">
        {fields.map(({ key, label, min, max, step }) => (
          <label key={key} className="pc-field">
            <span>{label}</span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={values[key]}
              onChange={(e) =>
                setValues((old) => ({
                  ...old,
                  [key]: boundedNumber(
                    e.target.value,
                    min,
                    min,
                    max,
                    step === 1,
                  ),
                }))
              }
            />
          </label>
        ))}
      </div>
      <div className="pc-score-summary" aria-live="polite">
        <div>
          <span className="pc-label">Film A · weighted</span>
          <strong>{score.toFixed(3)}</strong>
        </div>
        <div>
          <span className="pc-label">Film B · weighted</span>
          <strong>{reference.toFixed(3)}</strong>
        </div>
      </div>
      <p>
        {Math.abs(score - reference) < 0.000001
          ? 'The films are tied.'
          : `Film ${score > reference ? 'A' : 'B'} ranks higher after weighting.`}
      </p>
      {[
        { label: 'Film A raw mean', score: rating },
        { label: 'Shared prior', score: prior },
        { label: 'Film A weighted score', score },
        { label: 'Film B weighted score', score: reference },
      ].map(({ label, score: s }) => (
        <div key={label}>
          <div className="pc-result-label">
            <span>{label}</span>
            <strong>{s.toFixed(3)} / 10</strong>
          </div>
          <div
            className="pc-bar"
            role="img"
            aria-label={`${label}: ${s.toFixed(3)} out of 10`}
          >
            <span style={{ width: `${s * 10}%` }} />
          </div>
        </div>
      ))}
      <p className="pc-note">
        Film A: {(contribution * 100).toFixed(1)}% of the score comes from its
        votes; {((1 - contribution) * 100).toFixed(1)}% comes from the prior. At
        zero votes, the score equals the prior.
      </p>
      <div className="pc-actions">
        <button onClick={() => setValues(initial)}>Reset</button>
        <button
          onClick={() =>
            setValues((v) => ({
              ...v,
              votes: Math.min(1000000, v.votes * 10 || 10),
            }))
          }
        >
          Give Film A 10× the votes
        </button>
      </div>
      <button
        className="pc-text-button"
        aria-expanded={explain}
        onClick={() => setExplain((v) => !v)}
      >
        {explain ? 'Hide' : 'Show'} the calculation
      </button>
      {explain && (
        <div className="pc-explanation">
          <p>Weighted score = (v × R + m × C) / (v + m).</p>
          <p>
            Film A: ({votes} × {rating} + {weight} × {prior}) / ({votes} +{' '}
            {weight}) = {score.toFixed(3)}.
          </p>
          <p>
            The prior contributes the equivalent of m ratings at mean C. More
            observed votes reduce that influence smoothly; m is not an on/off
            gate. This score is a ranking heuristic, not a confidence interval
            or a probability that a film is good.
          </p>
        </div>
      )}
    </ExperimentFrame>
  );
}
