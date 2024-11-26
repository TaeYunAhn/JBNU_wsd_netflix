// Helper utility functions

/**
 * Format movie release date.
 * @param {string} date - Release date in YYYY-MM-DD format.
 * @returns {string} Formatted date as "Month Day, Year".
 */
export const formatDate = (date) => {
  if (!date) return 'Unknown';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Truncate text to a specific length.
 * @param {string} text - The text to truncate.
 * @param {number} length - Max length.
 * @returns {string} Truncated text with ellipsis.
 */
export const truncateText = (text, length = 100) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Generate a random integer between min and max (inclusive).
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Random integer.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
