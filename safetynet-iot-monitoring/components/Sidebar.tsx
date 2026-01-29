
import React from 'react';
import { View, UserRole } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  alertCount: number;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, alertCount, userRole, onLogout }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Command Center', icon: 'fa-gauge' },
    { id: View.HISTORY, label: 'Data Buffer', icon: 'fa-timeline' },
    { id: View.ALERTS, label: 'Crisis Log', icon: 'fa-triangle-exclamation', count: alertCount },
    { id: View.AI_INSIGHTS, label: 'Orchestrator', icon: 'fa-brain-circuit' },
    { id: View.DIAGNOSTICS, label: 'Lab & Diagnostics', icon: 'fa-vials' },
    { id: View.DATABASE_EXPLORER, label: 'SQL Explorer', icon: 'fa-database' },
    { id: View.ROUTINE, label: 'Life Optimizer', icon: 'fa-calendar-day' },
    { id: View.NEURAL_ANALYSIS, label: 'Neural Sync', icon: 'fa-microchip-ai' },
    { id: View.HARDWARE, label: 'Hardware Fleet', icon: 'fa-microchip' },
  ];

  return (
    <div className="w-64 h-screen bg-black border-r border-gray-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-10">
        <h1 className="text-3xl font-black text-indigo-500 flex items-center gap-4 tracking-tighter uppercase italic">
          <i className="fa-solid fa-shield-heart"></i>
          SafetyNet
        </h1>
        <p className="text-[10px] text-gray-600 mt-2 font-black uppercase tracking-[0.3em] border-l border-indigo-500 pl-4">IoT Health Engine</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40' 
                : 'text-gray-500 hover:bg-gray-900/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <i className={`fa-solid ${item.icon} w-5 text-center text-lg transition-transform group-hover:scale-110`}></i>
              <span className="font-black text-[10px] tracking-widest uppercase">{item.label}</span>
            </div>
            {item.count && item.count > 0 ? (
              <span className="bg-rose-600 text-white text-[9px] px-2 py-0.5 rounded-lg font-black relative z-10">
                {item.count}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-900 space-y-4">
        <div className="flex items-center gap-4 bg-gray-900/30 p-5 rounded-3xl border border-gray-800">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${userRole === 'DOCTOR' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
            <i className={`fa-solid ${userRole === 'DOCTOR' ? 'fa-user-doctor' : 'fa-id-badge'}`}></i>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white uppercase truncate tracking-tighter">{userRole === 'DOCTOR' ? 'Dr. Smith' : 'Patient_001'}</p>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{userRole}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 hover:text-rose-400 transition-all"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
