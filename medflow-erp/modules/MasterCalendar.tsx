
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter } from 'lucide-react';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM'
];

const doctors = [
  'Dr. Sarah Jenkins (Cardiology)',
  'Dr. Michael Chen (Orthopedics)',
  'Dr. Emma Wilson (Pediatrics)',
  'Dr. Robert Brown (General Medicine)'
];

const MasterCalendar: React.FC = () => {
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Day');

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Scheduling</h1>
          <p className="text-slate-500">Maximize doctor utility and manage patient throughput.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            <Plus size={18} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['Day', 'Week', 'Month'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
              <button className="p-1 hover:bg-white rounded-lg transition-all"><ChevronLeft size={16} /></button>
              <span className="text-sm font-bold min-w-[140px] text-center">October 24, 2024</span>
              <button className="p-1 hover:bg-white rounded-lg transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Departments</option>
                <option>Cardiology</option>
                <option>Orthopedics</option>
              </select>
            </div>
            <div className="relative">
              <select className="pl-4 pr-10 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>Filter by Doctor</option>
                {doctors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-slate-50/50 flex flex-wrap gap-6 border-b border-slate-100">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-xs font-semibold text-slate-600">Confirmed</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div><span className="text-xs font-semibold text-slate-600">Pending</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-xs font-semibold text-slate-600">Cancelled</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-xs font-semibold text-slate-600">Checked-In</span></div>
        </div>

        {/* Grid View */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[120px_repeat(4,1fr)] bg-slate-50 border-b border-slate-100">
              <div className="p-4"></div>
              {doctors.map(d => (
                <div key={d} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center border-l border-slate-100">{d.split(' ')[1]} {d.split(' ')[2]}</div>
              ))}
            </div>
            {timeSlots.map((time, idx) => (
              <div key={time} className="grid grid-cols-[120px_repeat(4,1fr)] border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                <div className="p-4 text-xs font-bold text-slate-400 border-r border-slate-100 text-center flex items-center justify-center">{time}</div>
                {doctors.map((_, dIdx) => {
                  // Simulate random appointments
                  const hasAppt = (idx + dIdx) % 5 === 0;
                  const status = ['Confirmed', 'Pending', 'Checked-In'][idx % 3];
                  return (
                    <div key={dIdx} className="p-2 border-l border-slate-100 min-h-[60px]">
                      {hasAppt && (
                        <div className={`p-2 rounded-lg text-xs font-semibold ${
                          status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          <p className="font-bold truncate">Patient #{100 + idx}</p>
                          <p className="opacity-70">{status}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterCalendar;
