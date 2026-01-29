
import React from 'react';
import { MOCK_QUEUE } from '../constants';
import { User, Users as UsersIcon, ChevronRight } from 'lucide-react';

const LiveQueue: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OPD Live Queue Board</h1>
          <p className="text-slate-500 italic">"At-a-glance" dashboard to prevent bottlenecks.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_QUEUE.map((q) => (
          <div key={q.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{q.doctorName}</h2>
                <div className="text-xs font-medium px-2 py-1 bg-white/10 rounded-lg uppercase tracking-widest text-blue-300">Consulting Now</div>
              </div>
              <div className="bg-blue-600 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/20">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-100 mb-1">CURRENT PATIENT</p>
                    <p className="text-2xl font-bold">{q.nowConsulting}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-200">TOKEN</p>
                  <p className="text-4xl font-black">#0{Math.floor(Math.random() * 50)}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <UsersIcon size={16} />
                Next 3 Patients
              </h3>
              <div className="space-y-3">
                {q.next3.map((patient, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-slate-700">{patient}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Estimated Wait Time for Others: <span className="text-blue-600 font-bold">22 Mins</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveQueue;
