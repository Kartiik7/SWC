import React from 'react';

const Loader = ({
  message = 'Loading CineVerse...',
  size = 'md', // sm, md, lg
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <div className={`animate-spin rounded-full border-gray-800 border-t-brand-accent ${sizeClasses[size]}`}></div>
      {message && <p className="text-gray-400 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg bg-opacity-90 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
