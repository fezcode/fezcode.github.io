import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import ProbabilityExperiment from './ProbabilityExperiment';
import ExperimentMarkdown from '../../components/ExperimentMarkdown';
import ProbabilityCabinetPage from '../../pages/apps/ProbabilityCabinetPage';

afterEach(cleanup);

it('preserves leading zeroes in a custom element’s numeric start attribute', async () => {
  render(
    <MemoryRouter>
      <ExperimentMarkdown rehypePlugins={[rehypeRaw]}>
        {
          '<probability-experiment experiment="kaprekars-routine" start="0001"></probability-experiment>'
        }
      </ExperimentMarkdown>
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole('textbox', {
      name: 'Starting number · four digits',
    }),
  ).toHaveValue('0001');
});

it('loads the optimal pirate split and explains the winning coalition', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="pirate-game" />
    </MemoryRouter>,
  );
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Reveal the backward-induction solution',
    }),
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Load optimal offer (98, 0, 1, 0, 1)' }),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Put it to a vote' }));
  expect(screen.getByText('Proposal accepted.')).toBeInTheDocument();
  expect(screen.getByText(/3 of 5 pirates voted yes/)).toBeInTheDocument();
  expect(screen.getAllByText('YES')).toHaveLength(3);
  fireEvent.change(
    screen.getByRole('spinbutton', { name: 'Coins for pirate B' }),
    { target: { value: '100' } },
  );
  expect(screen.getByRole('alert')).toHaveTextContent('2 coins more');
  expect(
    screen.getByRole('button', { name: 'Put it to a vote' }),
  ).toBeDisabled();
});

it('continues the game after rejection under strict-majority rules', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment
        experiment="pirate-game"
        pirates="2"
        rule="majority"
      />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Put it to a vote' }));
  expect(screen.getByText('Proposal rejected.')).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole('button', { name: 'Continue with captain E →' }),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Put it to a vote' }));
  expect(screen.getByText(/Captain E keeps 100 coins/)).toBeInTheDocument();
});

it('updates weighted ratings and carries inputs to the cabinet link', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="bayesian-ratings" />
    </MemoryRouter>,
  );
  expect(screen.getByText('7.780')).toBeInTheDocument();
  fireEvent.change(
    screen.getByRole('spinbutton', { name: 'Film A · votes v' }),
    { target: { value: '0' } },
  );
  expect(screen.getByText('6.500')).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /Open in Probability Cabinet/ }),
  ).toHaveAttribute(
    'href',
    '/apps/probability-cabinet?experiment=bayesian-ratings&rating=9&votes=0&prior=6.5&weight=100',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByText('7.780')).toBeInTheDocument();
});

it('steps through Kaprekar and handles the excluded repeated-digit case', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="kaprekars-routine" />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
  expect(screen.getByText(/After 1 step\(s\): 3087/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Run to fixed point' }));
  expect(screen.getByText(/Fixed point reached/)).toBeInTheDocument();
  fireEvent.change(
    screen.getByRole('textbox', { name: 'Starting number · four digits' }),
    { target: { value: '1111' } },
  );
  fireEvent.click(screen.getByRole('button', { name: 'Run to fixed point' }));
  expect(
    screen.getByText(/All-identical digits collapse to 0000/),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '12' } });
  expect(screen.getByRole('button', { name: 'Next step' })).toBeDisabled();
});

it.each([
  [
    'pirate-game',
    'pirates="2" rule="majority"',
    'Pirate Council experiment',
    'Captain D',
  ],
  [
    'bayesian-ratings',
    'rating="9" votes="0" prior="7" weight="100"',
    'Bayesian Ratings experiment',
    '7.000',
  ],
  [
    'kaprekars-routine',
    'start="1000"',
    'The 6174 Machine experiment',
    'Starting number · four digits',
  ],
])('renders %s from its custom Markdown tag', async (id, attrs, name, text) => {
  render(
    <MemoryRouter>
      <ExperimentMarkdown
        rehypePlugins={[rehypeRaw]}
      >{`<probability-experiment experiment="${id}" ${attrs}></probability-experiment>`}</ExperimentMarkdown>
    </MemoryRouter>,
  );
  expect(await screen.findByRole('region', { name })).toBeInTheDocument();
  expect(screen.getByText(text)).toBeInTheDocument();
});

it('opens a deep-linked experiment and switches cabinet entries', () => {
  render(
    <MemoryRouter
      initialEntries={[
        '/apps/probability-cabinet?experiment=kaprekars-routine&start=1000',
      ]}
    >
      <ProbabilityCabinetPage />
    </MemoryRouter>,
  );
  expect(screen.getByRole('textbox')).toHaveValue('1000');
  fireEvent.click(
    screen.getByRole('button', { name: /Game theory Pirate Council/ }),
  );
  expect(
    screen.getByRole('region', { name: 'Pirate Council experiment' }),
  ).toBeInTheDocument();
});
