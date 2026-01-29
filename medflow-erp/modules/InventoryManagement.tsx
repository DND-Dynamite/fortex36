
import React from 'react';
import { MOCK_INVENTORY } from '../constants';
import { Package, Truck, AlertTriangle, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

const InventoryManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory & Procurement</h1>
          <p className="text-slate-500">Real-time stock ledger with FIFO/LIFO tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200">
            <Truck size={18} />
            <span>Stock Inward</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100">
            <History size={18} />
            <span>Stock Outward</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold">Item Master Ledger</h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">Export CSV</button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr className="text-left border-b border-slate-100">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Item Details</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Batch/SKU</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Stock Level</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Expiry</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_INVENTORY.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.isAsset ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] font-medium text-slate-400">{item.isAsset ? 'Asset/Equipment' : 'Consumable'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-slate-700">Batch: {item.batch}</p>
                      <p className="text-[10px] text-slate-400">SKU: {item.sku}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${item.stock < 100 ? 'text-red-500' : 'text-slate-900'}`}>{item.stock}</span>
                        {item.stock < 100 && <AlertTriangle size={14} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold ${item.expiry === '2024-06-15' ? 'text-orange-500' : 'text-slate-500'}`}>{item.expiry}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:underline">Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <History size={18} className="text-blue-600" />
              Recent Movements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowDownLeft size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Stock Inward: PPE</p>
                  <p className="text-[10px] text-slate-400">Supplier: MedTech Corp</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">+500</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <ArrowUpRight size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Issue: Pharmacy</p>
                  <p className="text-[10px] text-slate-400">Ward A Dispensary</p>
                </div>
                <span className="text-xs font-bold text-red-600">-240</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-400 text-white rounded-xl"><AlertTriangle size={20} /></div>
              <h3 className="font-bold text-amber-900">Expiry Sentinel</h3>
            </div>
            <p className="text-xs text-amber-800 font-medium leading-relaxed mb-4">
              Automated scan found <span className="font-bold">2 items</span> expiring within 30 days. These batches have been disabled from selection.
            </p>
            <button className="w-full py-2.5 bg-amber-400 text-white font-bold rounded-xl text-xs hover:bg-amber-500 transition-all">Review Batches</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
