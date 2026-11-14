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
vi.mock('./context/VisualSettingsContext', () => ({
  VisualSettingsProvider: ({ children }) => children,
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

afterEach(cleanup);

describe('log view routing in App', () => {
  it.each(['/logs', '/discovery', '/discovery/game/example'])(
    'renders %s as the standalone shelf',
    async (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );
      expect(await screen.findByText('Shelf route')).toBeInTheDocument();
      expect(
        screen.queryByRole('region', { name: 'Classic layout' }),
      ).not.toBeInTheDocument();
    },
  );

  it.each(['/logs?view=classic', '/logs/game/example'])(
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
});
