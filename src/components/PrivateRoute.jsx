import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  // 인증 상태 확인
  const isAuthenticated = !!loggedInUser;

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
