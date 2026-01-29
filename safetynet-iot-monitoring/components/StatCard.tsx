
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  threshold?: { min?: number, max?: number };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, color, threshold }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const isCritical = threshold && (
    (threshold.min !== undefined && numericValue < threshold.min) || 
    (threshold.max !== undefined && numericValue > threshold.max)
  );

  return (
    <div className={`bg-gray-800 rounded-2xl p-5 border ${isCritical ? 'border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-gray-700'} transition-all hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${color}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isCritical ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
          {isCritical ? 'ANOMALY' : 'NORMAL'}
        </span>
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          <span className="text-gray-500 text-sm font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
