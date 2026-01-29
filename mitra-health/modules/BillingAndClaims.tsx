
import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Printer, FileText, Landmark, Search, Plus } from 'lucide-react';

const BillingAndClaims: React.FC = () => {
  const [payerType, setPayerType] = useState('Insurance');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Billing & Claims</h1>
          <p className="text-slate-500">Revenue Cycle Management (RCM) flow from bedside to pharmacy.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          <Landmark size={18} />
          <span>TPA Portal Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Final Bill Generation
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Ref: INV-88291</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Payer Category</label>
                  <select 
                    value={payerType}
                    onChange={(e) => setPayerType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option>Self-Pay</option>
                    <option>Insurance</option>
                    <option>Corporate</option>
                    <option>Govt Scheme</option>
                  </select>
                </div>
                {payerType === 'Insurance' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">TPA / Insurance Co.</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Search provider..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                )}
              </div>

              {/* Line Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Line Items (Fetched from modules)</label>
                  <button className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14} /> Add Service</button>
                </div>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-left">
                        <th className="p-3 text-[10px] font-bold text-slate-400 uppercase">Source</th>
                        <th className="p-3 text-[10px] font-bold text-slate-400 uppercase">Service Description</th>
                        <th className="p-3 text-[10px] font-bold text-slate-400 uppercase">Qty</th>
                        <th className="p-3 text-[10px] font-bold text-slate-400 uppercase text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="p-3"><span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded uppercase">IPD</span></td>
                        <td className="p-3 text-sm font-semibold">Standard Room Rent (3 Days)</td>
                        <td className="p-3 text-sm">3</td>
                        <td className="p-3 text-sm font-bold text-right">$1,500.00</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase">LIS</span></td>
                        <td className="p-3 text-sm font-semibold">CBC & Lipid Profile</td>
                        <td className="p-3 text-sm">1</td>
                        <td className="p-3 text-sm font-bold text-right">$125.00</td>
                      </tr>
                      <tr>
                        <td className="p-3"><span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded uppercase">RX</span></td>
                        <td className="p-3 text-sm font-semibold">Post-Op Medication Batch #A12</td>
                        <td className="p-3 text-sm">1</td>
                        <td className="p-3 text-sm font-bold text-right">$85.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Totals & Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            
            <div>
              <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Total Gross Amount</p>
              <p className="text-4xl font-black">$1,710.00</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Insurance Covered</span>
                <span className="text-sm font-bold text-emerald-400">-$1,200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Tax/VAT (5%)</span>
                <span className="text-sm font-bold">+$85.50</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-lg font-bold">Patient Payable</span>
                <span className="text-2xl font-black text-blue-400">$595.50</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
                <DollarSign size={20} />
                COLLECT PAYMENT
              </button>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                <Printer size={16} />
                Print Duplicate Bill
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Claim Status</p>
              <p className="font-bold text-emerald-600">Pre-Auth Approved</p>
              <p className="text-[10px] text-slate-400">Auth ID: CL-99201-B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAndClaims;
