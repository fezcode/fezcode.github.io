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
export const KEY_SIDEBAR_STATE = 'sidebar_state';
export const KEY_APPS_COLLAPSED_CATEGORIES = 'apps_collapsedCategories';

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
