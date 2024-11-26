import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  return loggedInUser ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
