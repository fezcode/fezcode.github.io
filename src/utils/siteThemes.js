export const SITE_THEMES = [
  {
    id: 'brutalist',
    name: 'Brufez',
    description: 'Systemic brutalism',
    background: '#050505',
    foreground: '#ffffff',
    accent: '#10b981',
  },
  {
    id: 'luxe',
    name: 'Fezluxe',
    description: 'Architectural elegance',
    background: '#ffffff',
    foreground: '#1a1a1a',
    accent: '#8d4004',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Bone paper and terra ink',
    background: '#f3ece0',
    foreground: '#1a1613',
    accent: '#c96442',
  },
  {
    id: 'mist',
    name: 'Mist',
    description: 'Eucalyptus veils and quiet horizons',
    background: '#eef2f1',
    foreground: '#3c4845',
    accent: '#5f837b',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'The registrar’s archive',
    background: '#fbfaf7',
    foreground: '#21222a',
    accent: '#0037d0',
  },
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'A personal observatory',
    background: '#f5f4ef',
    foreground: '#222d35',
    accent: '#3157ce',
  },
];

export const isSiteTheme = (value) =>
  SITE_THEMES.some(({ id }) => id === value);
