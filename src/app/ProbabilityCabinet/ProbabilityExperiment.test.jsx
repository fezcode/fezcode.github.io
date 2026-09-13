import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import ProbabilityExperiment from './ProbabilityExperiment';
import ExperimentMarkdown from '../../components/ExperimentMarkdown';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('renders a custom element within article prose while preserving other renderers', async () => {
  const consoleError = vi.spyOn(console, 'error');
  render(
    <MemoryRouter>
      <ExperimentMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: ({ children }) => <h2 data-testid="theme-heading">{children}</h2>,
        }}
      >
        {
          '## Try this\n\n<probability-experiment experiment="penneys-game" first="HHH" second="THH"></probability-experiment>\n\nContinue reading.'
        }
      </ExperimentMarkdown>
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole('region', { name: "Penney's Game experiment" }),
  ).toBeInTheDocument();
  expect(screen.getByText('87.5%')).toBeInTheDocument();
  expect(screen.getByTestId('theme-heading')).toHaveTextContent('Try this');
  expect(screen.getByText('Continue reading.')).toBeInTheDocument();
  expect(consoleError).not.toHaveBeenCalled();
  expect(
    screen.getByRole('link', { name: /Open in Probability Cabinet/ }),
  ).toHaveAttribute(
    'href',
    '/apps/probability-cabinet?experiment=penneys-game&first=HHH&second=THH',
  );
});

it('counts a completed manual game once and resets all evidence', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.1);
  render(
    <MemoryRouter>
      <ProbabilityExperiment first="HHH" second="THH" />
    </MemoryRouter>,
  );
  for (let i = 0; i < 3; i++)
    fireEvent.click(screen.getByRole('button', { name: 'Flip once' }));
  expect(screen.getByText('1 completed games')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Flip once' }));
  expect(screen.getByText('1 completed games')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByText('0 completed games')).toBeInTheDocument();
  expect(screen.getByText('No trials yet')).toBeInTheDocument();
});

it('runs exactly 1,000 games and cancels a batch on reset', () => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0.1);
  render(
    <MemoryRouter>
      <ProbabilityExperiment first="HHH" second="THH" />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Run 1,000 games' }));
  expect(screen.getByRole('button', { name: 'Flip once' })).toBeDisabled();
  act(() => vi.runAllTimers());
  expect(
    screen.getByText(`${(1000).toLocaleString()} completed games`),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Run 1,000 games' }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  act(() => vi.runAllTimers());
  expect(screen.getByText('0 completed games')).toBeInTheDocument();
});
