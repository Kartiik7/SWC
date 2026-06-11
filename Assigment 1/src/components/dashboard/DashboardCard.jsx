import React from 'react';

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend, // e.g. { type: 'up' | 'down', text: '+12% this week' }
  color = 'accent', // accent, gold, success, info, secondary
  className = '',
}) => {
  const colorMap = {
    accent: 'border-brand-accent/20 text-brand-accent bg-brand-accent/5',
    gold: 'border-brand-gold/20 text-brand-gold bg-brand-gold/5',
    success: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    info: 'border-blue-500/20 text-blue-400 bg-blue-500/5',
    secondary: 'border-gray-800 text-gray-400 bg-gray-900/40',
  };

  const ringColor = {
    accent: 'bg-brand-accent/10 text-brand-accent',
    gold: 'bg-brand-gold/10 text-brand-gold',
    success: 'bg-emerald-500/10 text-emerald-400',
    info: 'bg-blue-500/10 text-blue-400',
    secondary: 'bg-gray-800 text-gray-300',
  };

  return (
    <div className={`p-6 rounded-xl border bg-brand-card ${colorMap[color]} ${className} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${ringColor[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          {value}
        </h3>
        
        {trend && (
          <p className="text-xs flex items-center space-x-1">
            <span className={trend.type === 'up' ? 'text-emerald-400' : 'text-red-400'}>
              {trend.type === 'up' ? '▲' : '▼'} {trend.value}
            </span>
            <span className="text-gray-500">{trend.text}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
