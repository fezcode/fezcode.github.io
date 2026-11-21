import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/Layout', () => ({
  default: ({ children }) => (
    <section aria-label="Classic layout">{children}</section>
  ),
}));
vi.mock('./components/AnimatedRoutes', () => ({
  default: () => <p>Classic route</p>,
}));
vi.mock('./pages/discovery/DiscoveryPage', () => ({
  default: () => <p>Shelf route</p>,
}));
vi.mock('./context/AnimationContext', () => ({
  AnimationProvider: ({ children }) => children,
  useAnimation: () => ({ reduceMotion: true }),
}));
vi.mock('./context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
}));
vi.mock('./context/SiteConfigContext', () => ({
  SiteConfigProvider: ({ children }) => children,
}));
vi.mock('./context/CloudMusicContext', () => ({
  CloudMusicProvider: ({ children }) => children,
}));
vi.mock('./context/DndContext', () => ({
  DndProvider: ({ children }) => children,
}));
vi.mock('./context/AchievementContext', () => ({
  AchievementProvider: ({ children }) => children,
}));
vi.mock('./context/HomepageOrderContext', () => ({
  HomepageOrderProvider: ({ children }) => children,
}));
let mockedDiscoveryViewMode = 'shelf';
vi.mock('./context/VisualSettingsContext', () => ({
  VisualSettingsProvider: ({ children }) => children,
  useVisualSettings: () => ({ discoveryViewMode: mockedDiscoveryViewMode }),
}));
vi.mock('./context/CommandPaletteContext', () => ({
  CommandPaletteProvider: ({ children }) => children,
}));
vi.mock('./context/SidePanelContext', () => ({
  SidePanelProvider: ({ children }) => children,
}));
vi.mock('./components/AchievementListeners', () => ({ default: () => null }));
vi.mock('./components/DigitalRain', () => ({ default: () => null }));
vi.mock('./components/BSOD', () => ({ default: () => null }));
vi.mock('./components/ScrollToTop', () => ({ default: () => null }));
vi.mock('./components/ContactModal', () => ({ default: () => null }));
vi.mock('./components/GenericModal', () => ({ default: () => null }));
vi.mock('./app/apps/CloudMusicPlayer/components/TinyCloudPlayer', () => ({
  default: () => null,
}));
vi.mock('framer-motion', () => ({ MotionConfig: ({ children }) => children }));

afterEach(() => {
  cleanup();
  mockedDiscoveryViewMode = 'shelf';
});

describe('log view routing in App', () => {
  it.each([
    '/logs',
    '/logs/game/example',
    '/discovery',
    '/discovery/game/example',
  ])('renders %s as the standalone shelf by default', async (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Shelf route')).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'Classic layout' }),
    ).not.toBeInTheDocument();
  });

  it.each(['/logs?view=classic', '/logs/game/example?view=classic'])(
    'keeps %s inside the classic site layout',
    async (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );
      expect(
        await screen.findByRole('region', { name: 'Classic layout' }),
      ).toHaveTextContent('Classic route');
      expect(screen.queryByText('Shelf route')).not.toBeInTheDocument();
    },
  );

  it('renders /logs inside the classic layout when classic viewer is permanently selected, while keeping /logs?view=shelf and /discovery on the shelf', async () => {
    mockedDiscoveryViewMode = 'classic';
    const { unmount } = render(
      <MemoryRouter initialEntries={['/logs']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('region', { name: 'Classic layout' }),
    ).toHaveTextContent('Classic route');
    expect(screen.queryByText('Shelf route')).not.toBeInTheDocument();
    unmount();

    render(
      <MemoryRouter initialEntries={['/logs?view=shelf']}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Shelf route')).toBeInTheDocument();
  });
});
