import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem('VCAuthToken');
  if (!authToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

export { ProtectedRoute };
