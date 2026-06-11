import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader message="Securing session..." size="lg" />
      </div>
    );
  }

  // User is not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect authorized users to their respective dashboards
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (currentUser.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
