import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;

    const result = login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin/dashboard');
      else if (result.user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/user/dashboard');
    } else {
      setServerError(result.message);
    }
  };

  // Autofill helper for reviewers
  const handleQuickLogin = (role) => {
    const credentials = {
      user: { email: 'user@cineverse.com', password: 'password123' },
      owner: { email: 'owner@cineverse.com', password: 'password123' },
      admin: { email: 'admin@cineverse.com', password: 'password123' }
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setServerError('');
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
        <p className="text-sm text-gray-400">Sign in to check out the latest blockbusters</p>
      </div>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <Button type="submit" variant="primary" fullWidth className="py-2.5 mt-2">
          Sign In
        </Button>
      </form>

      {/* Quick Credentials Panel */}
      <div className="border-t border-gray-800 pt-5 space-y-3">
        <p className="text-center text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
          Quick Autofill for Review
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleQuickLogin('user')}
            className="px-2.5 py-1 text-xs bg-gray-900 border border-gray-800 text-gray-300 rounded hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            Customer
          </button>
          <button
            onClick={() => handleQuickLogin('owner')}
            className="px-2.5 py-1 text-xs bg-gray-900 border border-gray-800 text-gray-300 rounded hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            Theatre Owner
          </button>
          <button
            onClick={() => handleQuickLogin('admin')}
            className="px-2.5 py-1 text-xs bg-gray-900 border border-gray-800 text-gray-300 rounded hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            System Admin
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-accent hover:text-brand-hover font-semibold transition-colors">
          Create Signup
        </Link>
      </div>
    </div>
  );
};

export default Login;
