
import React from 'react';
import { Users, Clock, Calculator, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

const HumanResources: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Human Resources & Payroll</h1>
          <p className="text-slate-500">Manage 24/7 rotations and visiting consultant fee-for-service.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          Auto-Assign Shift
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Shift Roster */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold">Active Shift Roster (Today)</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase">Nursing</span>
                <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full uppercase">Front Desk</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { name: 'Dr. Sarah Jenkins', role: 'Cardiology', shift: 'Morning (08:00 - 16:00)', status: 'On-Floor' },
                { name: 'Nurse Joy Smith', role: 'Ward A', shift: 'Morning (08:00 - 16:00)', status: 'On-Floor' },
                { name: 'Dr. Michael Chen', role: 'Ortho', shift: 'Evening (16:00 - 00:00)', status: 'Upcoming' },
                { name: 'Mark Wilson', role: 'Technician', shift: 'Night (00:00 - 08:00)', status: 'Rest Period' },
              ].map((staff, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/32/32?random=${i}`} className="w-10 h-10 rounded-full grayscale" alt="Profile" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{staff.name}</p>
                      <p className="text-xs text-slate-500">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-700">{staff.shift}</p>
                    <p className="text-[10px] text-slate-400">Total: 40h/week</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase ${
                    staff.status === 'On-Floor' ? 'bg-emerald-50 text-emerald-600' :
                    staff.status === 'Upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Detection Logic Simulation */}
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-red-500" size={24} />
              <h3 className="font-bold text-red-900 uppercase tracking-widest text-sm">Fatigue Management Alert</h3>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-1">Roster Conflict: Nurse Joy Smith</p>
                <p className="text-xs text-red-700 leading-relaxed italic">"Mandatory 8-hour rest period not met between back-to-back night/morning shifts. System has blocked this assignment."</p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all">Resolve Override</button>
            </div>
          </div>
        </div>

        {/* Payout Calculator */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl"><Calculator size={20} /></div>
              <h3 className="font-bold text-lg">Consultant Payout</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Select Visiting Doctor</p>
                <select className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0">
                  <option>Dr. Sarah Jenkins</option>
                  <option>Dr. Michael Chen</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Consultations</p>
                  <p className="text-lg font-black">42</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Surgeries</p>
                  <p className="text-lg font-black">5</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue Share</p>
                  <p className="text-sm font-bold">70% to Consultant</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Billable</p>
                  <p className="text-sm font-bold">$12,400</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500">Calculated Payout</span>
                  <span className="text-2xl font-black text-blue-600">$8,680.00</span>
                </div>
                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} />
                  Approve & Process
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
              <AlertCircle size={18} />
              Cybersecurity Check
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 italic">
              "Ghost Employee Detection: Biometric cross-check active. Payroll only processes for staff with {'>'}80% shift clock-in attendance."
            </p>
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span>Integrity Scan</span>
              <span className="text-emerald-400">PASSED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanResources;
