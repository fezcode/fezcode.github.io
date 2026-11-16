/* global globalThis */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Node 22+ ships its own global `localStorage`/`sessionStorage`, which are
// undefined unless Node runs with --localstorage-file. That global shadows
// jsdom's storage, so tests calling localStorage.clear() crash. Install an
// in-memory Storage whenever the global one is missing.
class MemoryStorage {
  #items = new Map();
  get length() {
    return this.#items.size;
  }
  key(index) {
    return [...this.#items.keys()][index] ?? null;
  }
  getItem(key) {
    return this.#items.has(String(key)) ? this.#items.get(String(key)) : null;
  }
  setItem(key, value) {
    this.#items.set(String(key), String(value));
  }
  removeItem(key) {
    this.#items.delete(String(key));
  }
  clear() {
    this.#items.clear();
  }
}

for (const name of ['localStorage', 'sessionStorage']) {
  let current;
  try {
    current = globalThis[name];
  } catch {
    current = undefined;
  }
  if (!current || typeof current.clear !== 'function') {
    Object.defineProperty(globalThis, name, {
      value: new MemoryStorage(),
      configurable: true,
      writable: true,
    });
  }
}
