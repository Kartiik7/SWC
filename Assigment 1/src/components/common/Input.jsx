import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label} {required && <span className="text-brand-accent">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 bg-gray-900 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'
        } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
