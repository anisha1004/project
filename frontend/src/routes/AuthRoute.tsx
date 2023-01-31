import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem('VCAuthToken');
  if (authToken) {
    return <Navigate to="/" />;
  }
  return children;
};

export { AuthRoute };
