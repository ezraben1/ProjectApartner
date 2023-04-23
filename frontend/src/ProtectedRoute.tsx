import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactElement;
  user_type: string;
  allowed_user_types: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user_type, allowed_user_types, ...routeProps }) => {
  if (allowed_user_types.includes(user_type)) {
    return <Route {...routeProps} />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
