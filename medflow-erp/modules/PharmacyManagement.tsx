
import React from 'react';
import { Pill, Search, CheckCircle2, AlertCircle, ShoppingCart, Info } from 'lucide-react';
import { Prescription } from '../types';

const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 'RX-101', patientName: 'John Doe', doctorName: 'Dr. Jenkins', medication: 'Atorvastatin', dosage: '20mg', frequency: 'Once Daily', status: 'Pending', isUrgent: true },
  { id: 'RX-102', patientName: 'Sarah Smith', doctorName: 'Dr. Wilson', medication: 'Amoxicillin', dosage: '500mg', frequency: 'TDS x 5 days', status: 'Pending', isUrgent: false },
  { id: 'RX-103', patientName: 'Robert Brown', doctorName: 'Dr. Chen', medication: 'Metformin', dosage: '1000mg', frequency: 'BD', status: 'Out-of-Stock', isUrgent: false },
  { id: 'RX-104', patientName: 'Emma Wilson', doctorName: 'Dr. Jenkins', medication: 'Warfarin', dosage: '5mg', frequency: 'Once Daily', status: 'Dispensed', isUrgent: true },
];

const PharmacyManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pharmacy & Dispensary</h1>
          <p className="text-slate-500">Inventory-linked prescription fulfillment and drug safety.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2">
          <ShoppingCart size={18} />
          <span>New Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Pill size={20} className="text-blue-600" />
                Live Prescription Queue
              </h3>
              <div className="flex gap-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">2 Urgent</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {MOCK_PRESCRIPTIONS.map((rx) => (
                <div key={rx.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rx.id}</span>
                        {rx.isUrgent && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">Stat Order</span>}
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{rx.medication} {rx.dosage}</h4>
                      <p className="text-sm text-slate-500 font-medium">For: <span className="text-slate-700">{rx.patientName}</span> • Prescribed by: {rx.doctorName}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Info size={12} /> Frequency: {rx.frequency}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        rx.status === 'Dispensed' ? 'bg-emerald-50 text-emerald-600' :
                        rx.status === 'Out-of-Stock' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {rx.status}
                      </span>
                      <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        rx.status === 'Pending' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}>
                        {rx.status === 'Dispensed' ? 'View Bill' : 'Dispense Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety & Alerts Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              Safety Alerts (LASA)
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-800 mb-1">Look-Alike / Sound-Alike</p>
                <p className="text-xs text-red-600 leading-relaxed italic">
                  Warning: <span className="font-black">Dopamine</span> vs <span className="font-black">Dobutamine</span>. 
                  Always double-check vial concentration.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 mb-1">Drug Interaction Check</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Active monitoring of Warfarin + NSAID interactions is enabled for current ward patients.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
            <CheckCircle2 className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10" />
            <h3 className="text-lg font-bold mb-4">Stock Ledger</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Items Expiring (30d)</span>
                <span className="font-bold text-orange-400">12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Low Stock SKUs</span>
                <span className="font-bold text-red-400">08</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
                  Run Full Stock Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyManagement;
