
import React from 'react';
import { GameStatus } from '../types';

interface MemoryGridProps {
  activeTile: number | null;
  onTileClick: (index: number) => void;
  status: GameStatus;
  disabled: boolean;
}

const MemoryGrid: React.FC<MemoryGridProps> = ({ activeTile, onTileClick, status, disabled }) => {
  const tiles = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto w-full aspect-square p-2 bg-slate-200 rounded-2xl shadow-inner">
      {tiles.map((num) => {
        const isActive = activeTile === num;
        const isInputMode = status === GameStatus.INPUTTING;

        return (
          <button
            key={num}
            disabled={disabled}
            onClick={() => onTileClick(num)}
            className={`
              relative flex items-center justify-center rounded-xl text-2xl font-bold transition-all duration-150
              ${isActive 
                ? 'bg-yellow-400 scale-105 shadow-[0_0_25px_rgba(250,204,21,0.8)] z-10 border-4 border-yellow-200' 
                : 'bg-white text-slate-400 shadow-sm border-2 border-slate-100'
              }
              ${isInputMode && !disabled ? 'hover:bg-blue-50 hover:border-blue-200 active:scale-95 cursor-pointer' : 'cursor-default'}
              ${!isInputMode && !isActive ? 'opacity-60' : 'opacity-100'}
              h-full w-full
            `}
          >
            {num}
            {isActive && (
              <span className="absolute inset-0 bg-yellow-300 animate-ping rounded-xl opacity-20"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MemoryGrid;
