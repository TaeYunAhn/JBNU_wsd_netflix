/**
 * Validate email format.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if password is at least 6 characters long.
 */
export const isValidPassword = (password) => {
  return password.length >= 6;
};

/**
 * Confirm password match.
 * @param {string} password - The first password.
 * @param {string} confirmPassword - The second password to match.
 * @returns {boolean} True if passwords match, false otherwise.
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
