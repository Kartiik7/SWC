import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  // If already logged in, redirect to respective dashboard
  if (currentUser) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'owner') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center p-4 relative"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.9), rgba(11, 15, 25, 0.95)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80')` 
      }}
    >
      <div className="mb-6 flex items-center space-x-2 text-white font-black text-3xl tracking-widest animate-fadeIn">
        <Film className="h-8 w-8 text-brand-accent animate-pulse" />
        <span>CINEVERSE</span>
      </div>

      <div className="w-full max-w-md bg-brand-card/75 border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-xl transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
