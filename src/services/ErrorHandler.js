const ErrorHandler = {
  handleAPIError: (error) => {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.message}`);
      return error.response.data.message;
    } else if (error.request) {
      console.error('API Error: No response received');
      return 'No response received from server';
    } else {
      console.error(`Error: ${error.message}`);
      return error.message;
    }
  },
};

export default ErrorHandler;
