
import React from 'react';
import { MOCK_LAB_ORDERS } from '../constants';
import { CheckCircle2, FlaskConical, Clipboard, Zap, ArrowRight, Activity } from 'lucide-react';

const LabTracker: React.FC = () => {
  const steps = ['Ordered', 'Sample-Collected', 'In-Process', 'Results-Ready'];

  const getStepIndex = (status: string) => steps.indexOf(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lab Workflow Status</h1>
          <p className="text-slate-500">Eliminate manual entry and reduce turnaround time (TAT).</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500" size={20} />
          <div className="text-sm">
            <span className="font-bold text-emerald-700">Analyzer Connected:</span>
            <span className="ml-2 text-emerald-600 font-medium italic">Siemens Roche X200</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {MOCK_LAB_ORDERS.map((order) => (
            <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><FlaskConical size={24} /></div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-0.5">{order.id}</p>
                    <h3 className="text-lg font-bold text-slate-900">{order.testName}</h3>
                    <p className="text-sm text-slate-500 font-medium">Patient: {order.patientName}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-2xl px-4">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 z-0"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 z-0 transition-all duration-1000" style={{ width: `${(getStepIndex(order.status) / (steps.length - 1)) * 100}%` }}></div>
                    
                    {steps.map((step, idx) => {
                      const isActive = getStepIndex(order.status) >= idx;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 text-white scale-110' : 'bg-slate-200 text-slate-400'}`}>
                            {isActive ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{step.replace('-', ' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-xs text-slate-400 font-bold uppercase">TAT</p>
                    <p className="text-sm font-bold text-slate-700">45m rem.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                    {order.status === 'Results-Ready' ? 'Verify Report' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Result Entry Portal Interface Simulation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              Automated Result Entry
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Real-time Feed</span>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Parameter</th>
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Result</th>
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Ref Range</th>
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="py-3 text-sm font-semibold text-slate-700">Hemoglobin</td>
                <td className="py-3 text-sm font-black text-red-600">9.2 g/dL</td>
                <td className="py-3 text-sm text-slate-500">12.0 - 15.0</td>
                <td className="py-3 text-right text-xs font-bold text-red-500">LOW ▼</td>
              </tr>
              <tr>
                <td className="py-3 text-sm font-semibold text-slate-700">WBC Count</td>
                <td className="py-3 text-sm font-black text-slate-900">11,500 /µL</td>
                <td className="py-3 text-sm text-slate-500">4,500 - 11k</td>
                <td className="py-3 text-right text-xs font-bold text-orange-500">HIGH ▲</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Approve & Push to EHR</button>
            <button className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200">Rerun Test</button>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <Activity className="absolute -bottom-6 -right-6 w-40 h-40 opacity-10" />
          <h3 className="text-lg font-bold mb-2">Smart Alert Engine</h3>
          <p className="text-blue-100 text-sm mb-6">Monitoring is_abnormal flag in real-time. Life-threatening results skip the queue and trigger immediate SMS alerts.</p>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Active Sentinel Job</p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Scan frequency: Every 30s</span>
              <span className="text-xs bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTracker;
