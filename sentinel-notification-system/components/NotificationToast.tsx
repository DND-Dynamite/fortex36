
import React, { useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, X, Users } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  count?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const NotificationToast: React.FC<Props> = ({ title, message, count, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000); // Increased duration for detailed messages
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { 
      icon: <CheckCircle className="w-5 h-5" />, 
      bg: 'bg-slate-900', 
      border: 'border-emerald-500/50', 
      accent: 'text-emerald-500', 
      glow: 'shadow-emerald-500/10' 
    },
    error: { 
      icon: <AlertTriangle className="w-5 h-5" />, 
      bg: 'bg-slate-900', 
      border: 'border-rose-500/50', 
      accent: 'text-rose-500', 
      glow: 'shadow-rose-500/10' 
    },
    warning: { 
      icon: <AlertTriangle className="w-5 h-5" />, 
      bg: 'bg-slate-900', 
      border: 'border-amber-500/50', 
      accent: 'text-amber-500', 
      glow: 'shadow-amber-500/10' 
    },
    info: { 
      icon: <Info className="w-5 h-5" />, 
      bg: 'bg-slate-900', 
      border: 'border-indigo-500/50', 
      accent: 'text-indigo-500', 
      glow: 'shadow-indigo-500/10' 
    }
  }[type];

  return (
    <div className={`fixed bottom-6 right-6 w-96 ${config.bg} border ${config.border} rounded-xl shadow-2xl ${config.glow} z-50 overflow-hidden animate-in slide-in-from-right duration-300`}>
      <div className="flex items-start p-4 gap-4">
        <div className={`mt-1 p-2 rounded-lg ${config.accent} bg-slate-950 border border-slate-800`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-slate-100 text-sm truncate">{title}</h4>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3">
            {message}
          </p>
          {count !== undefined && (
            <div className="flex items-center gap-2 py-1.5 px-2 bg-slate-950 rounded-md border border-slate-800 inline-flex">
              <Users className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                {count} Stakeholders Notified
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={`h-1 w-full bg-slate-800`}>
        <div className={`h-full ${config.accent.replace('text-', 'bg-')} animate-shrink-width`} style={{ animationDuration: '6000ms', animationTimingFunction: 'linear' }} />
      </div>
      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-width {
          animation-name: shrink-width;
        }
      `}</style>
    </div>
  );
};
