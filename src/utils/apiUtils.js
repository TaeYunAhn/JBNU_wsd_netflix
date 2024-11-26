import ErrorHandler from '../services/ErrorHandler';

/**
 * Handle TMDb API requests.
 * @param {Function} apiCall - API call function returning a promise.
 * @returns {Object} The response data or an error message.
 */
export const handleApiRequest = async (apiCall) => {
  try {
    const response = await apiCall();
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = ErrorHandler.handleAPIError(error);
    return { success: false, message: errorMessage };
  }
};
