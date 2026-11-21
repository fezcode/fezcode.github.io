import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LogViewSwitch from './LogViewSwitch';
import { isShelfLogLocation } from '../utils/discoveryMode';
import { useVisualSettings } from '../context/VisualSettingsContext';

vi.mock('../context/VisualSettingsContext', () => ({
  useVisualSettings: vi.fn(() => ({ discoveryViewMode: 'shelf' })),
}));

afterEach(() => {
  cleanup();
  useVisualSettings.mockReturnValue({ discoveryViewMode: 'shelf' });
});

describe('log presentation navigation', () => {
  it.each([
    ['/logs', 'shelf', true],
    ['/logs/', 'shelf', true],
    ['/logs?view=classic', 'shelf', false],
    ['/logs?view=shelf', 'shelf', true],
    ['/logs/game/example', 'shelf', true],
    ['/logs/game/example?view=classic', 'shelf', false],
    ['/discovery', 'shelf', true],
    ['/discovery/game/example', 'shelf', true],
    ['/blog/example', 'shelf', false],
    ['/logs', 'classic', false],
    ['/logs/', 'classic', false],
    ['/logs/game/example', 'classic', false],
    ['/logs?view=shelf', 'classic', true],
    ['/logs?view=classic', 'classic', false],
    ['/discovery', 'classic', true],
    ['/discovery/game/example', 'classic', true],
  ])(
    'selects the intended presentation for %s when default is %s',
    (url, defaultMode, expected) => {
      const location = new URL(url, 'https://fezcode.com');
      expect(isShelfLogLocation(location, defaultMode)).toBe(expected);
    },
  );

  it('lets a keyboard user leave the shelf for the explicit classic index', () => {
    render(
      <MemoryRouter initialEntries={['/discovery']}>
        <Routes>
          <Route path="/discovery" element={<LogViewSwitch view="shelf" />} />
          <Route path="/logs" element={<p>Classic index</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Shelf view' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const classic = screen.getByRole('link', { name: 'Classic view' });
    expect(classic).toHaveAttribute('href', '/logs?view=classic');
    userEvent.tab();
    expect(classic).toHaveFocus();
    userEvent.keyboard('{Enter}');
    expect(screen.getByText('Classic index')).toBeInTheDocument();
  });

  it('links the classic index back to the default shelf', () => {
    render(
      <MemoryRouter initialEntries={['/logs?view=classic']}>
        <LogViewSwitch view="classic" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Classic view' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Shelf view' })).toHaveAttribute(
      'href',
      '/logs',
    );
  });

  it('uses explicit shelf query parameter when classic is the saved default', () => {
    useVisualSettings.mockReturnValue({ discoveryViewMode: 'classic' });
    render(
      <MemoryRouter initialEntries={['/logs']}>
        <LogViewSwitch view="classic" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Classic view' })).toHaveAttribute(
      'href',
      '/logs',
    );
    expect(screen.getByRole('link', { name: 'Shelf view' })).toHaveAttribute(
      'href',
      '/logs?view=shelf',
    );
  });
});
