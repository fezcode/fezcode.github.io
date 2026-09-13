import React from 'react';
import { Link } from 'react-router-dom';
import PenneyExperiment from './PenneyExperiment';
import PirateExperiment from './PirateExperiment';
import BayesianExperiment from './BayesianExperiment';
import KaprekarExperiment from './KaprekarExperiment';
import './probability.css';

const components = {
  'penneys-game': PenneyExperiment,
  'pirate-game': PirateExperiment,
  'bayesian-ratings': BayesianExperiment,
  'kaprekars-routine': KaprekarExperiment,
};
export default function ProbabilityExperiment({
  experiment = 'penneys-game',
  ...props
}) {
  const Component = components[experiment];
  return Component ? (
    <Component {...props} />
  ) : (
    <p>
      Experiment unavailable.{' '}
      <Link to="/apps/probability-cabinet">
        Explore the Probability Cabinet
      </Link>
      .
    </p>
  );
}
