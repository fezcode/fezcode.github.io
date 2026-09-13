import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import OrbitRegister from './OrbitRegister';
import * as storage from '../../utils/LocalStorageManager';

describe('Orbit appearance', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(cleanup);

  it('keeps navbar and sidebar controls in sync and restores the saved appearance', () => {
    localStorage.setItem('ledger-register', JSON.stringify('4'));
    const view = render(
      <>
        <OrbitRegister />
        <OrbitRegister />
      </>,
    );
    fireEvent.click(
      screen.getAllByRole('button', { name: /currently Daylight/ })[0],
    );
    expect(
      screen.getAllByRole('button', { name: /currently Night/ }),
    ).toHaveLength(2);
    expect(document.documentElement.dataset.orbitRegister).toBe('night');
    expect(JSON.parse(localStorage.getItem('orbit-palette'))).toBe('night');
    expect(JSON.parse(localStorage.getItem('ledger-register'))).toBe('4');
    view.unmount();
    render(<OrbitRegister />);
    expect(
      screen.getByRole('button', { name: /currently Night/ }),
    ).toBeInTheDocument();
  });

  it('follows external preference writes without overwriting them on mount', () => {
    render(<OrbitRegister />);
    act(() => storage.set('orbit-palette', 'night'));
    expect(
      screen.getByRole('button', { name: /currently Night/ }),
    ).toBeInTheDocument();
    act(() => {
      localStorage.setItem('orbit-palette', JSON.stringify('day'));
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'orbit-palette' }),
      );
    });
    expect(
      screen.getByRole('button', { name: /currently Daylight/ }),
    ).toBeInTheDocument();
  });

  it('recovers from an unknown saved palette and lets the reader change it', () => {
    localStorage.setItem('orbit-palette', JSON.stringify('missing-palette'));
    render(<OrbitRegister />);
    fireEvent.click(screen.getByRole('button', { name: /currently Daylight/ }));
    expect(document.documentElement.dataset.orbitRegister).toBe('night');
  });
});
