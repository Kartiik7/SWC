import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // user or owner
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;

    const result = signup(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      if (result.user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/user/dashboard');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-wide">Create Account</h2>
        <p className="text-sm text-gray-400">Join CineVerse and start booking tickets</p>
      </div>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        {/* Role Selection */}
        <div className="flex flex-col space-y-1.5 w-full">
          <label className="text-sm font-medium text-gray-300">Register As</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-3 rounded-lg border text-sm font-semibold cursor-pointer transition-all duration-200 ${
              formData.role === 'user'
                ? 'bg-brand-accent/10 border-brand-accent text-white'
                : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'
            }`}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Customer</span>
            </label>
            
            <label className={`flex items-center justify-center p-3 rounded-lg border text-sm font-semibold cursor-pointer transition-all duration-200 ${
              formData.role === 'owner'
                ? 'bg-brand-gold/10 border-brand-gold text-white'
                : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'
            }`}>
              <input
                type="radio"
                name="role"
                value="owner"
                checked={formData.role === 'owner'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Theatre Owner</span>
            </label>
          </div>
        </div>

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" variant="primary" fullWidth className="py-2.5 mt-2">
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-accent hover:text-brand-hover font-semibold transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
