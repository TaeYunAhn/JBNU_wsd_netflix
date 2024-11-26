import { LOCAL_STORAGE_KEYS } from './constants';

/**
 * Manage local storage for the application.
 */
export const StorageUtils = {
  /**
   * Get an item from local storage.
   * @param {string} key - The key to retrieve.
   * @returns {any} Parsed JSON or null if not found.
   */
  getItem: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Set an item in local storage.
   * @param {string} key - The key to store.
   * @param {any} value - The value to store.
   */
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Remove an item from local storage.
   * @param {string} key - The key to remove.
   */
  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  /**
   * Clear all local storage keys.
   */
  clear: () => {
    localStorage.clear();
  },
};
