
import React from 'react';
import { MOCK_BEDS } from '../constants';
import { Bed as BedType } from '../types';
import { Clock, User, Trash2 } from 'lucide-react';

const BedMap: React.FC = () => {
  const getStatusColor = (status: BedType['status']) => {
    switch (status) {
      case 'Occupied': return 'bg-red-500 ring-red-100';
      case 'Cleaning': return 'bg-amber-400 ring-amber-100';
      case 'Available': return 'bg-emerald-500 ring-emerald-100';
      default: return 'bg-slate-300 ring-slate-100';
    }
  };

  const getStatusText = (status: BedType['status']) => {
    switch (status) {
      case 'Occupied': return 'text-red-700 bg-red-50';
      case 'Cleaning': return 'text-amber-700 bg-amber-50';
      case 'Available': return 'text-emerald-700 bg-emerald-50';
      default: return 'text-slate-700 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ward A: Bed Map</h1>
          <p className="text-slate-500">Live grid of ward occupancy and turnover status.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 px-3">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-xs font-semibold">Occupied</span>
          </div>
          <div className="flex items-center gap-2 px-3 border-x border-slate-200">
            <div className="w-3 h-3 rounded bg-amber-400"></div>
            <span className="text-xs font-semibold">Cleaning</span>
          </div>
          <div className="flex items-center gap-2 px-3">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-xs font-semibold">Available</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_BEDS.map((bed) => (
          <div 
            key={bed.id} 
            className={`relative p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-slate-900">{bed.number}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusText(bed.status)}`}>
                {bed.status}
              </span>
            </div>

            <div className="min-h-[60px] flex flex-col justify-center">
              {bed.status === 'Occupied' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User size={14} className="text-slate-400" />
                    <span className="text-sm font-semibold truncate">{bed.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs">Admitted for {bed.daysSinceAdmission} days</span>
                  </div>
                </div>
              ) : bed.status === 'Cleaning' ? (
                <div className="flex flex-col items-center justify-center text-slate-400 py-2">
                  <Trash2 size={20} className="mb-1" />
                  <span className="text-xs font-medium italic">Sanitization in progress...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <span className="text-sm font-medium text-emerald-600">Ready for Admission</span>
                </div>
              )}
            </div>

            <div className={`absolute top-0 right-0 w-1 h-full rounded-r-2xl ${getStatusColor(bed.status).split(' ')[0]}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BedMap;
