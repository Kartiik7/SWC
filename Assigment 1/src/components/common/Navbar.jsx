import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, User, LogOut, Menu, X, MapPin, ShieldAlert, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../hooks/useBooking';
import Badge from './Badge';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { selectedLocation, selectLocation } = useBooking();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin/dashboard';
    if (currentUser.role === 'owner') return '/owner/dashboard';
    return '/user/dashboard';
  };

  const getNavLinks = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'user') {
      return [
        { name: 'Dashboard', path: '/user/dashboard' },
        { name: 'Movies', path: '/user/movies' },
        { name: 'My Bookings', path: '/user/history' },
        { name: 'Profile', path: '/user/profile' },
      ];
    }
    if (currentUser.role === 'owner') {
      return [
        { name: 'Dashboard', path: '/owner/dashboard' },
        { name: 'Movies', path: '/owner/movies' },
        { name: 'Shows', path: '/owner/shows' },
        { name: 'Screens', path: '/owner/screens' },
        { name: 'Bookings', path: '/owner/bookings' },
      ];
    }
    if (currentUser.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Theatres', path: '/admin/theatres' },
        { name: 'Requests', path: '/admin/requests' },
        { name: 'Reports', path: '/admin/reports' },
      ];
    }
    return [];
  };

  return (
    <nav className="glass-morphism-nav sticky top-0 z-40 w-full px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to={getDashboardLink()} className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-wider hover:opacity-90">
          <Film className="h-6 w-6 text-brand-accent animate-pulse" />
          <span className="bg-gradient-to-r from-white via-gray-200 to-brand-accent bg-clip-text text-transparent">CineVerse</span>
        </Link>

        {/* Desktop Location Picker (For Customers/Users or generic) */}
        {currentUser && currentUser.role === 'user' && (
          <div className="hidden md:flex items-center space-x-2 bg-gray-900/80 border border-gray-800 rounded-full px-3 py-1 text-sm text-gray-300">
            <MapPin className="h-4 w-4 text-brand-accent" />
            <select
              value={selectedLocation}
              onChange={(e) => selectLocation(e.target.value)}
              className="bg-transparent focus:outline-none border-none pr-4 text-white text-xs cursor-pointer"
            >
              <option value="" className="bg-brand-bg text-white">Select Location</option>
              {cities.map((city) => (
                <option key={city} value={city} className="bg-brand-bg text-white">{city}</option>
              ))}
            </select>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {getNavLinks().map((link) => {
            const isActive = routerLocation.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
                  isActive ? 'text-brand-accent border-b-2 border-brand-accent pb-1' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3 border-l border-gray-800 pl-4">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-semibold">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1">
                  {currentUser.role === 'admin' && <ShieldAlert className="h-3 w-3 text-red-500" />}
                  {currentUser.role === 'owner' && <Briefcase className="h-3 w-3 text-brand-gold" />}
                  <Badge variant={currentUser.role === 'admin' ? 'danger' : currentUser.role === 'owner' ? 'gold' : 'primary'}>
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
              
              <Link to={currentUser.role === 'user' ? '/user/profile' : '#'} className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors border border-gray-700">
                <User className="h-4 w-4 text-white" />
              </Link>
              
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-gray-400 hover:text-brand-accent p-2 hover:bg-gray-800/40 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-3">
          {currentUser && currentUser.role === 'user' && (
            <div className="flex items-center space-x-1 bg-gray-900 border border-gray-800 rounded-full px-2 py-0.5 text-xs text-gray-300">
              <MapPin className="h-3 w-3 text-brand-accent" />
              <select
                value={selectedLocation}
                onChange={(e) => selectLocation(e.target.value)}
                className="bg-transparent focus:outline-none border-none text-white text-[10px] cursor-pointer"
              >
                <option value="" className="bg-brand-bg">Select Location</option>
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-brand-bg">{city}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-800 flex flex-col space-y-3 pb-2 animate-fadeIn">
          {getNavLinks().map((link) => {
            const isActive = routerLocation.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium px-2 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-brand-accent/10 text-brand-accent' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          {currentUser ? (
            <div className="border-t border-gray-800 pt-3 flex flex-col space-y-3 px-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-300 font-semibold">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-500">{currentUser.email}</p>
                </div>
                <Badge variant={currentUser.role === 'admin' ? 'danger' : currentUser.role === 'owner' ? 'gold' : 'primary'}>
                  {currentUser.role}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {currentUser.role === 'user' && (
                  <Link
                    to="/user/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center bg-gray-800 text-white py-1.5 rounded-lg text-xs hover:bg-gray-700"
                  >
                    View Profile
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 bg-brand-accent text-white py-1.5 rounded-lg text-xs hover:bg-brand-hover"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-center bg-brand-accent text-white py-2 rounded-lg text-sm font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
