/**
 * LocalStorageManager.js
 *
 * A centralized module for managing localStorage keys and interactions.
 * This prevents key name collisions and standardizes getting/setting values.
 */

// --- Key Definitions ---

// Animation Settings
export const KEY_IS_ANIMATION_ENABLED = 'isAnimationEnabled';
export const KEY_SHOW_ANIMATIONS_HOMEPAGE = 'showAnimationsHomepage';
export const KEY_SHOW_ANIMATIONS_INNER_PAGES = 'showAnimationsInnerPages';

// Sidebar Section States
export const KEY_SIDEBAR_IS_MAIN_OPEN = 'sidebar_isMainOpen';
export const KEY_SIDEBAR_IS_CONTENT_OPEN = 'sidebar_isContentOpen';
export const KEY_SIDEBAR_IS_APPS_OPEN = 'sidebar_isAppsOpen';
export const KEY_SIDEBAR_IS_EXTRAS_OPEN = 'sidebar_isExtrasOpen';
export const KEY_SIDEBAR_IS_GAMES_OPEN = 'sidebar_isGamesOpen';
export const KEY_SIDEBAR_IS_EXTERNAL_LINKS_OPEN = 'sidebar_isExternalLinksOpen';

export const SIDEBAR_KEYS = [
  KEY_SIDEBAR_IS_MAIN_OPEN,
  KEY_SIDEBAR_IS_CONTENT_OPEN,
  KEY_SIDEBAR_IS_APPS_OPEN,
  KEY_SIDEBAR_IS_EXTRAS_OPEN,
  KEY_SIDEBAR_IS_GAMES_OPEN,
  KEY_SIDEBAR_IS_EXTERNAL_LINKS_OPEN,
];

// --- Utility Functions ---

/**
 * Safely gets and parses a value from localStorage.
 * @param {string} key The localStorage key.
 * @param {*} defaultValue The default value to return if the key doesn't exist or an error occurs.
 * @returns {*} The parsed value or the default value.
 */
export const get = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading '${key}' from localStorage`, error);
    return defaultValue;
  }
};

/**
 * Safely sets a value in localStorage.
 * @param {string} key The localStorage key.
 * @param {*} value The value to be stringified and stored.
 */
export const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing '${key}' to localStorage`, error);
  }
};

/**
 * Safely removes a value from localStorage.
 * @param {string} key The localStorage key to remove.
 */
export const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing '${key}' from localStorage`, error);
  }
};
