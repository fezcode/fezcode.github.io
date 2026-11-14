import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LogViewSwitch from './LogViewSwitch';
import { isShelfLogLocation } from '../utils/discoveryMode';

afterEach(cleanup);

describe('log presentation navigation', () => {
  it.each([
    ['/logs', true],
    ['/logs/', true],
    ['/logs?view=classic', false],
    ['/logs?view=shelf', true],
    ['/logs/game/example', false],
    ['/discovery', true],
    ['/discovery/game/example', true],
    ['/blog/example', false],
  ])('selects the intended presentation for %s', (url, expected) => {
    const location = new URL(url, 'https://fezcode.com');
    expect(isShelfLogLocation(location)).toBe(expected);
  });

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
});
