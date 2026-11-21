// Avoid "logview.js": privacy filter lists block requests for that filename.
export const DISCOVERY_VIEW_MODES = ['shelf', 'classic'];
export const CLASSIC_LOGS_PATH = '/logs?view=classic';
export const SHELF_LOGS_PATH = '/logs';
export const EXPLICIT_SHELF_LOGS_PATH = '/logs?view=shelf';

export function isShelfLogLocation(
  { pathname, search = '' },
  defaultMode = 'shelf',
) {
  if (pathname === '/discovery' || pathname.startsWith('/discovery/')) {
    return true;
  }
  const isLogsIndex = /^\/logs\/?$/.test(pathname);
  const isLogsEntry = /^\/logs\/[^/]+\/[^/]+\/?$/.test(pathname);
  if (!isLogsIndex && !isLogsEntry) {
    return false;
  }
  const requested = new URLSearchParams(search).get('view');
  if (requested === 'classic') return false;
  if (requested === 'shelf') return true;
  return defaultMode !== 'classic';
}
