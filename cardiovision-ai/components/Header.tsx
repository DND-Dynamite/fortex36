
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">CardioVision</h1>
        </div>
        {/* <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Analyzer</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">History</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Settings</a>
        </nav> 
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          Documentation
        </button> */}
      </div>
    </header>
  );
};

export default Header;
