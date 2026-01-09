export const vocabulary = {
  'prop-drilling': {
    title: 'Prop Drilling',
    loader: () => import('./vocab/prop-drilling'),
  },
  'context-api': {
    title: 'Context API',
    loader: () => import('./vocab/context-api'),
  },
  'anti-pattern': {
    title: 'Anti-Pattern',
    loader: () => import('./vocab/anti-pattern'),
  },
  pluribus: {
    title: 'Pluribus',
    loader: () => import('./vocab/pluribus'),
  },
  'side-effects': {
    title: 'Side Effects',
    loader: () => import('./vocab/side-effects'),
  },
  'poi-rating': {
    title: "Person of Interest's Rating",
    loader: () => import('./vocab/poi-rating'),
  },
  'game-of-the-year': {
    title: 'Game of the Year (GOTY)',
    loader: () => import('./vocab/game-of-the-year'),
  },
  murakami: {
    title: 'Murakami, Takashi',
    loader: () => import('./vocab/murakami'),
  },
  ssg: {
    title: 'Static Site Generation (SSG)',
    loader: () => import('./vocab/ssg'),
  },
  csr: {
    title: 'Client-Side Rendering (CSR)',
    loader: () => import('./vocab/csr'),
  },
  hydration: {
    title: 'Hydration',
    loader: () => import('./vocab/hydration'),
  },
  spa: {
    title: 'Single Page Application (SPA)',
    loader: () => import('./vocab/spa'),
  },
  crawler: {
    title: 'Search Engine Crawler',
    loader: () => import('./vocab/crawler'),
  },
  'open-graph': {
    title: 'Open Graph Protocol',
    loader: () => import('./vocab/open-graph'),
  },
  'name-mangling': {
    title: 'Name Mangling',
    loader: () => import('./vocab/name-mangling'),
  },
  'modules-vs-includes': {
    title: 'Modules vs. Includes',
    loader: () => import('./vocab/modules-vs-includes'),
  },
};
