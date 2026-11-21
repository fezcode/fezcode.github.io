import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import FezzillaPage from './FezzillaPage';
import RoadmapItemDetailPage from './RoadmapItemDetailPage';

const unlockAchievement = vi.fn();
let theme = 'brutalist';
vi.mock('../../context/AchievementContext', () => ({
  useAchievements: () => ({ unlockAchievement }),
}));
vi.mock('../../context/VisualSettingsContext', () => ({
  useVisualSettings: () => ({ fezcodexTheme: theme }),
}));
vi.mock('../../components/Seo', () => ({ default: () => null }));
const data = `(issues)
  > (issues)
    (id) FEZ-1
    (title) Cloud support
    (description) Connect a backend.
    (status) On Hold
    (category) Infrastructure
    (priority) High
    (epic) Core Infrastructure
    (assignee) Fezcodex
  > (issues)
    (id) FEZ-2
    (title) Better search
    (description) Find your ideas.
    (status) Completed
    (category) Utilities
  > (issues)
    (id) FEZ-3
    (title) New editor
    (description) Write something new.
    (status) Planned
`;
function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}
function setup(path = '/roadmap') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FezzillaPage />
      <Location />
    </MemoryRouter>,
  );
}
beforeEach(() => {
  theme = 'brutalist';
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, text: async () => data }),
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
describe('Roadmap', () => {
  it('loads real counts, combines search and status filters, and clears empty results', async () => {
    setup();
    await screen.findByRole('heading', { name: 'Cloud support' });
    expect(
      screen.getByRole('img', { name: '1 of 3 issues completed' }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Infrastructure' },
    });
    expect(
      screen.getByRole('heading', { name: 'Cloud support' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Better search' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Shipped 1' }));
    expect(screen.getByText('No matching issues')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(
      screen.getByRole('heading', { name: 'Better search' }),
    ).toBeInTheDocument();
  });
  it('opens keyboard-operable details, preserves URL parameters, and restores focus on close', async () => {
    setup('/roadmap?source=test');
    const issue = await screen.findByRole('button', {
      name: /FEZ-1 Cloud support/,
    });
    issue.focus();
    fireEvent.click(issue);
    const dialog = screen.getByRole('dialog', { name: 'Cloud support' });
    expect(
      screen.getByRole('link', { name: 'Open issue page', exact: true }),
    ).toHaveAttribute('href', '/roadmap/FEZ-1');
    expect(screen.getByTestId('location')).toHaveTextContent(
      '?source=test&issue=FEZ-1',
    );
    fireEvent(
      dialog,
      new Event('cancel', { bubbles: false, cancelable: true }),
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('?source=test');
    expect(issue).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });
  it('supports direct issue URLs and the Luxe theme', async () => {
    theme = 'luxe';
    setup('/roadmap?issue=FEZ-2');
    await screen.findByRole('dialog', { name: 'Better search' });
    expect(screen.getByRole('main')).toHaveClass('roadmap-luxe');
  });
  it('retries failed requests instead of displaying an empty roadmap', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    setup();
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByRole('heading', { name: 'Cloud support' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('combines priority and folder filters', async () => {
    setup();
    await screen.findByRole('heading', { name: 'Cloud support' });
    fireEvent.click(
      screen.getByRole('button', { name: 'Priority', exact: true }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'High', exact: true }));
    expect(
      screen.getByRole('heading', { name: 'Cloud support' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Better search' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Shipped 1' }));
    expect(screen.getByText('No matching issues')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(
      screen.getByRole('heading', { name: 'Better search' }),
    ).toBeInTheDocument();
  });
  it('combines custom metadata filters and resets every selection', async () => {
    setup();
    await screen.findByRole('heading', { name: 'Cloud support' });
    for (const [label, option] of [
      ['Category', 'Infrastructure'],
      ['Epic', 'Core Infrastructure'],
      ['Assignee', 'Fezcodex'],
    ]) {
      fireEvent.click(screen.getByRole('button', { name: label, exact: true }));
      fireEvent.click(
        screen.getByRole('button', { name: option, exact: true }),
      );
    }
    expect(
      screen.getByRole('heading', { name: 'Cloud support' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Better search' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Epic', exact: true }));
    fireEvent.click(
      screen.getByRole('button', { name: 'No epic', exact: true }),
    );
    expect(screen.getByText('No matching issues')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(
      screen.getByRole('heading', { name: 'Better search' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Category', exact: true }),
    ).toHaveTextContent('All categories');
    expect(
      screen.getByRole('button', { name: 'Epic', exact: true }),
    ).toHaveTextContent('All epics');
    expect(
      screen.getByRole('button', { name: 'Assignee', exact: true }),
    ).toHaveTextContent('All assignees');
  });
  it('shows newest issues first and uses issue numbers when dates are absent', async () => {
    setup();
    await screen.findByRole('heading', { name: 'Cloud support' });
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['New editor', 'Better search', 'Cloud support']);
  });
  it('orders dated issues by creation date before issue number', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () =>
        data
          .replace(
            '(id) FEZ-1',
            '(id) FEZ-1\n    (created_at) 2026-11-20T12:00:00+03:00',
          )
          .replace(
            '(id) FEZ-3',
            '(id) FEZ-3\n    (created_at) 2026-10-20T12:00:00+03:00',
          ),
    });
    setup();
    await screen.findByRole('heading', { name: 'Cloud support' });
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Cloud support', 'New editor', 'Better search']);
  });
  it("filters Won't do issues and shows their status in the modal", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => data.replace('(status) On Hold', "(status) Won't Do"),
    });
    setup();
    await screen.findByRole('heading', { name: 'Cloud support' });
    fireEvent.click(screen.getByRole('button', { name: "Won't do 1" }));
    expect(
      screen.queryByRole('heading', { name: 'Better search' }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: /FEZ-1 Cloud support/ }),
    );
    expect(
      screen.getByRole('dialog', { name: 'Cloud support' }),
    ).toHaveTextContent("Won't do");
  });
});

describe('Dedicated roadmap issue page', () => {
  const openIssue = (id) =>
    render(
      <MemoryRouter initialEntries={[`/roadmap/${id}`]}>
        <Routes>
          <Route path="/roadmap/:id" element={<RoadmapItemDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  it('uses matching status labels and navigates between issues in newest-first order', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => data.replace('(status) On Hold', "(status) Won't Do"),
    });
    openIssue('FEZ-1');
    await screen.findByRole('heading', { name: 'Cloud support', level: 1 });
    expect(screen.getAllByText("Won't do").length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: 'Back to roadmap' }),
    ).toHaveAttribute('href', '/roadmap');
    fireEvent.click(screen.getByRole('link', { name: /Newer issue \/ FEZ-2/ }));
    await screen.findByRole('heading', { name: 'Better search', level: 1 });
    expect(screen.getAllByText('Shipped').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('heading', { name: 'Cloud support', level: 1 }),
    ).not.toBeInTheDocument();
  });
  it('provides a route back for missing issues', async () => {
    openIssue('FEZ-999');
    await screen.findByRole('heading', { name: 'Issue not found' });
    expect(
      screen.getByRole('link', { name: 'Browse all issues' }),
    ).toHaveAttribute('href', '/roadmap');
  });
  it('recovers from a failed request', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    openIssue('FEZ-2');
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByRole('heading', { name: 'Better search', level: 1 });
  });
});
