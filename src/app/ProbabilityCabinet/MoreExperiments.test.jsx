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
  [
    'milgram-obedience',
    'guess="3"',
    'The Shock Generator experiment',
    'Take the teacher’s seat',
  ],
  [
    'razor-drawer',
    'case="deploy-check"',
    'The Razor Drawer experiment',
    'Do not remove a fence until you know why it was put there.',
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

it('ends the shock session only after all four prods and compares the break-off', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="milgram-obedience" guess="3" />
    </MemoryRouter>,
  );
  expect(screen.getByRole('spinbutton')).toHaveValue(3);
  fireEvent.click(
    screen.getByRole('button', { name: 'Take the teacher’s seat' }),
  );
  for (let v = 15; v <= 150; v += 15) {
    fireEvent.click(screen.getByRole('button', { name: `Administer ${v} V` }));
  }
  expect(screen.getByText(/heart trouble/)).toBeInTheDocument();
  expect(screen.getByText('165 V')).toBeInTheDocument();
  const stop = () =>
    fireEvent.click(screen.getByRole('button', { name: 'I want to stop' }));
  stop();
  expect(screen.getByText('Please continue.')).toBeInTheDocument();
  // Administering a shock restarts the prod sequence, as in the original.
  fireEvent.click(screen.getByRole('button', { name: 'Administer 165 V' }));
  stop();
  expect(screen.getByText('Please continue.')).toBeInTheDocument();
  stop();
  stop();
  stop();
  expect(
    screen.getByText('You have no other choice. You must go on.'),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole('button', { name: 'I refuse. End the experiment.' }),
  );
  expect(screen.getByText('You stopped at 165 V.')).toBeInTheDocument();
  expect(
    screen.getByText(
      /1 of 40 subjects stopped exactly here, 6 stopped earlier, and 33 went further/,
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(/You predicted 3 in 100/)).toBeInTheDocument();
  expect(screen.getByText('Stopped at 165 V · you')).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /Open in Probability Cabinet/ }),
  ).toHaveAttribute(
    'href',
    '/apps/probability-cabinet?experiment=milgram-obedience&guess=3',
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Reveal what moved the number' }),
  );
  expect(
    screen.getByText('Two fellow teachers refuse first'),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Sit down again' }));
  expect(
    screen.getByRole('button', { name: 'Take the teacher’s seat' }),
  ).toBeInTheDocument();
});

it('reports full obedience at 450 V', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="milgram-obedience" />
    </MemoryRouter>,
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Take the teacher’s seat' }),
  );
  for (let v = 15; v <= 450; v += 15) {
    fireEvent.click(screen.getByRole('button', { name: `Administer ${v} V` }));
  }
  expect(screen.getByText('Fully obedient.')).toBeInTheDocument();
  expect(screen.getByText(/So were 26 of the 40 people/)).toBeInTheDocument();
});

it('confronts a razor pick with the razors that disagree, then tallies the drawer', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="razor-drawer" case="deploy-check" />
    </MemoryRouter>,
  );
  expect(screen.getByText(/Case 01 of 05/)).toHaveTextContent(
    'The ninety-second sleep',
  );
  fireEvent.click(
    screen.getByRole('button', { name: /Chesterton’s Fence/ }),
  );
  expect(
    screen.getByText('Chesterton’s Fence: Leave it until you know.'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Reaches the opposite conclusion · same facts'),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Occam’s Razor: Take it out\./),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Popper’s Criterion: Make it forbid something\./),
  ).toBeInTheDocument();
  expect(screen.getByText(/slowest cold start/)).toBeInTheDocument();

  // Walk the remaining four cases so the tally has something to count.
  for (let i = 0; i < 4; i++) {
    fireEvent.click(screen.getByRole('button', { name: 'Next case →' }));
    fireEvent.click(screen.getAllByRole('button', { name: /Razor/ })[0]);
  }
  fireEvent.click(
    screen.getByRole('button', { name: 'See what that says about you' }),
  );
  expect(screen.getByText('Your cuts')).toBeInTheDocument();
  expect(screen.getByText(/a razor you did not pick/)).toBeInTheDocument();
});

it('names a razor that has no jurisdiction over the facts', () => {
  render(
    <MemoryRouter>
      <ProbabilityExperiment experiment="razor-drawer" case="smart-meter" />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: /Hanlon’s Razor/ }));
  expect(screen.getByText(/no jurisdiction over these facts/)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Open the whole drawer' }));
  expect(screen.getByText('Every razor in the drawer')).toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(9);
});
