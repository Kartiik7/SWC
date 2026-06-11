import React from 'react';

const Badge = ({
  children,
  variant = 'default', // default, primary, success, warning, danger, gold, info
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide';
  
  const variants = {
    default: 'bg-gray-800 text-gray-300 border border-gray-700',
    primary: 'bg-red-500/10 text-brand-accent border border-brand-accent/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-red-600/10 text-red-400 border border-red-500/20',
    gold: 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
