import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={role === 'ADMIN' ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
