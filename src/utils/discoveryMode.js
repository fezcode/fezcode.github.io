// Avoid "logview.js": privacy filter lists block requests for that filename.
export const CLASSIC_LOGS_PATH = '/logs?view=classic';
export const SHELF_LOGS_PATH = '/logs';

// Only the index changes its default presentation. Existing classic detail
// links keep their theme-aware pages, and discovery showcase links stay valid.
export function isShelfLogLocation({ pathname, search = '' }) {
  return (
    pathname === '/discovery' ||
    pathname.startsWith('/discovery/') ||
    (/^\/logs\/?$/.test(pathname) &&
      new URLSearchParams(search).get('view') !== 'classic')
  );
}
