module.exports = {
  primary: {
    400: '#f87171', // red-400
    500: '#ef4444', // red-500
    600: '#dc2626', // red-600
  },
  secondary: {
    400: '#fb923c', // orange-400
  },
  tb: '#00000033',
  book: '#00BFFF',
  movie: '#DC143C',
  game: '#00C9A7',
  article: '#FA8072', // Salmon
  app: '#fb8476', // Duplicated from article-ish
  music: '#F3E5AB',
  series: '#edc531',
  food: '#F4A259',
  websites: '#00FF7F',
  tools: '#e0aaff',
  'book-light': '#4dcdff',
  'movie-light': '#e84f6d',
  'game-light': '#00e6bf',
  'article-light': '#FFB6C1', // Light Pink
  'app-light': '#FFF8F00', // Duplicated from book-light
  'music-light': '#fcf2cf',
  'series-light': '#F5E080',
  'food-light': '#FFC780',
  'websites-light': '#4dff99',
  'tools-light': '#F0DFFF',
  'newspaper-background': '#fdfdf5',
  'sidebar-highlight': '#FA8072', // Duplicated from article
  'sidebar-highlight-light': '#FFB6C1', // Duplicated from article-light
  'sidebar-highlight-alpha-10': 'rgba(250, 128, 114, 0.1)', // Duplicated from article-alpha-10
  'sidebar-highlight-alpha-50': 'rgba(250, 128, 114, 0.5)', // Duplicated from article-alpha-50
  'title-hover': '#fdd4a6', // orange-200
  'markdown-title-color': '#fed7aa', // orange-200
  'markdown-hx-color': '#ffedd5', // orange-100
  'dev-card-bg': 'var(--bg-dev-card)',
  'dev-card-bg-hover': 'var(--bg-dev-card-hover)',
  'takes-card-bg': 'var(--bg-takes-card)',
  'takes-card-bg-hover': 'var(--bg-takes-card-hover)',
  'series-card-bg': 'var(--bg-series-card)',
  'series-card-bg-hover': 'var(--bg-series-card-hover)',
  'dnd-card-bg': 'var(--bg-dnd-card)',
  'dnd-card-bg-hover': 'var(--bg-dnd-card-hover)',
  'gist-card-bg': 'var(--bg-gist-card)',
  'gist-card-bg-hover': 'var(--bg-gist-card-hover)',
  'book-alpha-10': 'rgba(0, 191, 255, 0.1)',
  'book-alpha-50': 'rgba(0, 191, 255, 0.5)',
  'movie-alpha-10': 'rgba(220, 20, 60, 0.1)',
  'movie-alpha-50': 'rgba(220, 20, 60, 0.5)',
  'game-alpha-10': 'rgba(0, 201, 167, 0.1)',
  'game-alpha-50': 'rgba(0, 201, 167, 0.5)',
  'article-alpha-10': 'rgba(250, 128, 114, 0.1)',
  'article-alpha-50': 'rgba(250, 128, 114, 0.5)',
  'app-alpha-10': 'rgba(160, 123, 144, 0.1)', // Duplicated from music
  'app-alpha-50': 'rgba(160, 123, 144, 0.5)', // Duplicated from music
  'music-alpha-10': 'rgba(243, 229, 171, 0.1)',
  'music-alpha-50': 'rgba(243, 229, 171, 0.5)',
  'series-alpha-10': 'rgba(237, 197, 49, 0.1)',
  'series-alpha-50': 'rgba(237, 197, 49, 0.5)',
  'food-alpha-10': 'rgba(244, 162, 89, 0.1)',
  'food-alpha-50': 'rgba(244, 162, 89, 0.5)',
  'websites-alpha-10': 'rgba(0, 255, 127, 0.1)',
  'websites-alpha-50': 'rgba(0, 255, 127, 0.5)',
  'tools-alpha-10': 'rgba(224, 170, 255, 0.1)',
  'tools-alpha-50': 'rgba(224, 170, 255, 0.5)',

  // Toast success colors
  'toast-background': 'rgba(72,59,87,0.8)',
  'toast-hover-background': 'rgba(102,84,122,0.8)',
  'toast-border': '#514b68',

  // Toast error colors
  'toast-error-background': 'rgba(87,59,59,0.8)',
  'toast-error-hover-background': 'rgba(122,84,84,0.8)',
  'toast-error-border': '#684b4b',

  // Code Theme Colors (from src/utils/customTheme.js)
  codeTheme: {
    'text-default': '#d1d5db',
    background: '#1f2937',
    'selection-background': '#3c526d',
    comment: '#8da1b9',
    punctuation: '#e3eaf2',
    'keyword-important': '#66cccc',
    tag: '#66cccc',
    'variable-scss': '#66cccc',
    'attr-name': '#e6d37a',
    boolean: '#e6d37a',
    number: '#e6d37a',
    constant: '#e6d37a',
    'string-url-link': '#e6d37a',
    'brace-level-1': '#e6d37a',
    'class-name': '#6cb8e6',
    key: '#6cb8e6',
    property: '#6cb8e6',
    'function-markdown-title': '#6cb8e6',
    'brace-level-3': '#6cb8e6',
    'attr-value': '#91d076',
    inserted: '#91d076',
    string: '#91d076',
    'brace-level-markdown-url': '#91d076',
    builtin: '#f4adf4',
    regex: '#f4adf4',
    'brace-level-2': '#f4adf4',
    function: '#c699e3',
    'selector-class': '#c699e3',
    'brace-level-4': '#c699e3',
    'atrule-rule': '#e9ae7e',
    keyword: '#e9ae7e',
    operator: '#e9ae7e',
    selector: '#e9ae7e',
    deleted: '#cd6660',
    important: '#cd6660',
    'toolbar-text': '#111b27',
    'toolbar-background': '#6cb8e6', // Added for clarity, as it's used with toolbar-text
    'toolbar-hover-background': '#6cb8e6da',
    'line-highlight-hover': '#8da1b918',
    'line-numbers-border': '#0b121b',
    'line-numbers-background': '#0b121b7a',
    'line-numbers-text': '#8da1b9da',
    'diff-deleted-background': '#cd66601f',
    'diff-inserted-background': '#91d0761f',
    'line-highlight-gradient':
      'linear-gradient(to right, #3c526d5f 70%, #3c526d55)',
    'line-highlight-start': '#3c526d5f',
    'line-highlight-end': '#3c526d55',
  },
};
