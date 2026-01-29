
import React from 'react';
import { ImageFilters } from '../types';

interface ToolbarProps {
  filters: ImageFilters;
  onChange: (filters: ImageFilters) => void;
  onReset: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ filters, onChange, onReset }) => {
  const handleChange = (key: keyof ImageFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Image Processing</h3>
        <button 
          onClick={onReset}
          className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Brightness</span>
            <span className="mono">{filters.brightness}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="200" 
            value={filters.brightness}
            onChange={(e) => handleChange('brightness', parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Contrast</span>
            <span className="mono">{filters.contrast}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="200" 
            value={filters.contrast}
            onChange={(e) => handleChange('contrast', parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Exposure</span>
            <span className="mono">{filters.exposure}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="200" 
            value={filters.exposure}
            onChange={(e) => handleChange('exposure', parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-300">Negative View</label>
            <button
              onClick={() => handleChange('invert', !filters.invert)}
              className={`w-10 h-5 rounded-full transition-colors relative ${filters.invert ? 'bg-blue-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${filters.invert ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
