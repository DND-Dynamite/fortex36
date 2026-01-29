
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Bed, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, visits: 240 },
  { name: 'Tue', revenue: 3000, visits: 139 },
  { name: 'Wed', revenue: 2000, visits: 980 },
  { name: 'Thu', revenue: 2780, visits: 390 },
  { name: 'Fri', revenue: 1890, visits: 480 },
  { name: 'Sat', revenue: 2390, visits: 380 },
  { name: 'Sun', revenue: 3490, visits: 430 },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Command Center</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={24} /></div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Daily Revenue (AR)</p>
          <p className="text-2xl font-bold mt-1">$42,500</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bed size={24} /></div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded">Near Capacity</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Bed Occupancy</p>
          <p className="text-2xl font-bold mt-1">94%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Users size={24} /></div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">1:8 Ratio</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Staffing Levels</p>
          <p className="text-2xl font-bold mt-1">142 Staff</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={24} /></div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Optimal</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg Wait Time</p>
          <p className="text-2xl font-bold mt-1">18 mins</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Revenue vs Expense Monitor</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Patient Volume (OPD vs IPD)</h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="visits" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Alerts Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Critical Alerts</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">Clear All</button>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Inventory Alert: PPE Shortage</p>
              <p className="text-xs text-slate-500">Surgical Gloves - Size 7 below threshold (50 units remaining).</p>
            </div>
            <span className="ml-auto text-xs text-slate-400">2m ago</span>
          </div>
          <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
            <div>
              <p className="text-sm font-semibold text-slate-900">RCM: Claims Pending TPA Approval</p>
              <p className="text-xs text-slate-500">12 claims over $5,000 awaiting TPA response {'>'} 48hrs.</p>
            </div>
            <span className="ml-auto text-xs text-slate-400">15m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
