
import React, { useState, useCallback } from 'react';
import { 
  Bell, 
  Users, 
  Activity, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Plus, 
  Trash2, 
  Terminal,
  RefreshCw,
  Send
} from 'lucide-react';
import { Alarm, Stakeholder, Severity, AlarmStatus, StakeholderRole, NotificationLog } from './types';
import { dispatchAlarm } from './services/notificationService';
import { NotificationToast } from './components/NotificationToast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: 'John Miller', email: 'john@sentinel.io', phone: '+123456789', role: StakeholderRole.ENGINEER, isActive: true },
  { id: '2', name: 'Sarah Chen', email: 'sarah@sentinel.io', phone: '+123456780', role: StakeholderRole.MANAGER, isActive: true },
  { id: '3', name: 'Mike Security', email: 'mike@sentinel.io', phone: '+123456781', role: StakeholderRole.SECURITY, isActive: true },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stakeholders' | 'logs' | 'terminal'>('dashboard');
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(INITIAL_STAKEHOLDERS);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string; type: any; count?: number } | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const chartData = alarms.slice(-10).map((a) => ({
    name: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    severity: a.severity === Severity.CRITICAL ? 100 : a.severity === Severity.WARNING ? 50 : 20
  }));

  const handleIncomingAlarm = useCallback(async (rawAlarm: Partial<Alarm>) => {
    setIsDispatching(true);
    
    // Simulate brief network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      source: rawAlarm.source || 'System',
      type: rawAlarm.type || 'General',
      description: rawAlarm.description || 'No description provided',
      severity: rawAlarm.severity || Severity.INFO,
      status: AlarmStatus.ACTIVE,
      notifiedStakeholders: [],
    };

    // Direct Dispatch Logic
    const { logs: newLogs, notifiedIds } = dispatchAlarm(newAlarm, stakeholders);
    
    newAlarm.notifiedStakeholders = notifiedIds;
    setLogs(prev => [...newLogs, ...prev]);
    setAlarms(prev => [newAlarm, ...prev]);
    
    setToast({ 
      title: `${newAlarm.severity} ALARM DISPATCHED`,
      message: `Direct notification for "${newAlarm.type}" sent to active personnel. Source: ${newAlarm.source}`, 
      type: newAlarm.severity === Severity.CRITICAL ? 'error' : newAlarm.severity === Severity.WARNING ? 'warning' : 'success',
      count: notifiedIds.length
    });

    setIsDispatching(false);
  }, [stakeholders]);

  const toggleStakeholderStatus = (id: string) => {
    setStakeholders(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const removeStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bell className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight uppercase">Sentinel</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Dispatch Core</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Activity className="w-5 h-5" />
            <span className="font-medium">Live Feed</span>
          </button>
          <button onClick={() => setActiveTab('stakeholders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'stakeholders' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium">Stakeholders</span>
          </button>
          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'logs' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'hover:bg-slate-800 text-slate-400'}`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Transmission Logs</span>
          </button>
          <button onClick={() => setActiveTab('terminal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'terminal' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Terminal className="w-5 h-5" />
            <span className="font-medium">System Hook</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors cursor-pointer group">
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span className="font-medium">Node Config</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize tracking-tight">{activeTab === 'terminal' ? 'Webhook Simulator' : activeTab}</h2>
            <p className="text-slate-500 text-sm">Automated alert routing & personnel dispatch</p>
          </div>
          <div className="flex gap-4">
            {isDispatching && (
              <div className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/20 rounded-lg flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Dispatching Packets...</span>
              </div>
            )}
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">API GATEWAY ACTIVE</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Traffic Volume
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Area type="monotone" dataKey="severity" stroke="#6366f1" fillOpacity={1} fill="url(#colorSev)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4 hover:border-rose-500/30 transition-all">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="text-rose-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Unresolved Critical</p>
                    <p className="text-2xl font-bold text-white">{alarms.filter(a => a.severity === Severity.CRITICAL).length}</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4 hover:border-emerald-500/30 transition-all">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-emerald-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Stakeholders Online</p>
                    <p className="text-2xl font-bold text-white">{stakeholders.filter(s => s.isActive).length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[500px] shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                Live Incident Stream
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {alarms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <Activity className="w-12 h-12 mb-4" />
                    <p className="italic text-sm">Listening for incoming data...</p>
                  </div>
                ) : (
                  alarms.map(alarm => (
                    <div key={alarm.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg transition-all hover:border-slate-700 hover:shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          alarm.severity === Severity.CRITICAL ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          alarm.severity === Severity.WARNING ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {alarm.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(alarm.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-200 mb-1">{alarm.type}</h4>
                      <p className="text-xs text-slate-400 mb-3">{alarm.description}</p>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500 italic">Dispatched to {alarm.notifiedStakeholders.length} targets</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stakeholders' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-indigo-500 p-2 bg-indigo-500/10 rounded-lg" />
                <div>
                  <h3 className="text-xl font-bold">Personnel Registry</h3>
                  <p className="text-slate-500 text-sm">System administrators and technical responders.</p>
                </div>
              </div>
              <button 
                onClick={() => setToast({ title: 'New Entry', message: 'Registry modification is currently locked by central admin.', type: 'info' })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Personnel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {stakeholders.map(person => (
                <div key={person.id} className={`bg-slate-900 border rounded-xl p-6 transition-all shadow-md ${person.isActive ? 'border-slate-800' : 'border-slate-800/50 opacity-60 grayscale'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-lg text-indigo-400 shadow-inner">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleStakeholderStatus(person.id)}
                        className={`p-2 rounded-lg transition-colors ${person.isActive ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                        title={person.isActive ? "Set Offline" : "Set Online"}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeStakeholder(person.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{person.name}</h4>
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">{person.role}</p>
                  
                  <div className="space-y-3 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800"><Info className="w-3 h-3 opacity-60" /></div>
                      <span className="truncate">{person.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800"><Activity className="w-3 h-3 opacity-60" /></div>
                      <span>{person.phone}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Availability Status</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${person.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                      {person.isActive ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Transmission Audit
              </h3>
              <div className="px-3 py-1 bg-slate-800 rounded-full">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-widest">Total Packets: {logs.length}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">TS_HEX</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Protocol</th>
                    <th className="px-6 py-4">Message Segment</th>
                    <th className="px-6 py-4 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic">No network traffic detected. Use System Hook to trigger alerts.</td>
                    </tr>
                  ) : (
                    logs.map(log => {
                      const stakeholder = stakeholders.find(s => s.id === log.stakeholderId);
                      return (
                        <tr key={log.id} className="hover:bg-indigo-500/5 transition-colors group">
                          <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                            [{new Date(log.sentAt).toLocaleTimeString()}]
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-300">{stakeholder?.name || 'Unknown'}</div>
                            <div className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">{stakeholder?.role}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold bg-slate-950 border border-slate-800 px-2 py-1 rounded text-indigo-400">
                              {log.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate text-slate-400 group-hover:text-slate-200 transition-colors">
                            {log.message}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-emerald-500 font-bold text-[10px] uppercase flex items-center justify-end gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-6">
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-indigo-400 mb-2">Simulate Alarm Ingestion</h3>
              <p className="text-slate-400 text-sm">
                Bypass standard filters to test the direct dispatch pipeline. Every field entered here is transmitted verbatim to active stakeholders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-400 flex items-center gap-2 tracking-widest uppercase">
                    <Send className="w-4 h-4 text-indigo-500" /> Dispatch Payload
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Alarm Header</label>
                    <input type="text" id="sim-type" defaultValue="Leak Detected" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 focus:border-indigo-500/50 outline-none text-sm font-mono text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Source ID</label>
                    <input type="text" id="sim-source" defaultValue="Pipeline-Alpha-4" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 focus:border-indigo-500/50 outline-none text-sm font-mono text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Priority Flag</label>
                    <select id="sim-severity" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 focus:border-indigo-500/50 outline-none text-sm font-mono text-slate-200 appearance-none">
                      <option value={Severity.INFO}>LOW (INFO)</option>
                      <option value={Severity.WARNING}>MEDIUM (WARNING)</option>
                      <option value={Severity.CRITICAL}>HIGH (CRITICAL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Full Message Body</label>
                    <textarea id="sim-desc" rows={4} defaultValue="Pressure differential mismatch in Segment 3. Automated shutoff valves engaged. Manual inspection required immediately." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 focus:border-indigo-500/50 outline-none text-sm font-mono text-slate-200 resize-none transition-all"></textarea>
                  </div>
                </div>
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                  <button 
                    onClick={() => {
                      const type = (document.getElementById('sim-type') as HTMLInputElement).value;
                      const source = (document.getElementById('sim-source') as HTMLInputElement).value;
                      const severity = (document.getElementById('sim-severity') as HTMLSelectElement).value as Severity;
                      const description = (document.getElementById('sim-desc') as HTMLTextAreaElement).value;
                      handleIncomingAlarm({ type, source, severity, description });
                    }}
                    disabled={isDispatching}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                  >
                    {isDispatching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
                    EXECUTE DISPATCH
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative shadow-xl overflow-hidden group">
                 <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                    <Terminal className="w-64 h-64" />
                 </div>
                 <h4 className="font-bold text-slate-400 text-xs uppercase mb-6 flex items-center gap-3">
                    <Info className="w-5 h-5 text-indigo-500" /> Operational Specs
                 </h4>
                 <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
                    <p>
                      The <span className="text-white font-semibold">Direct Transmission Pipeline</span> ensures that data provided by the source is sent exactly as-is to all active personnel.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span><b className="text-slate-200">Zero Processing:</b> No AI analysis or content filtering is applied during execution.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span><b className="text-slate-200">Parallel Routing:</b> Notifications are pushed to all online stakeholders simultaneously.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span><b className="text-slate-200">Persistence:</b> Every dispatch is logged with a unique transaction ID for audit trailing.</span>
                      </li>
                    </ul>
                    <div className="mt-10 p-5 bg-slate-950 rounded-xl border border-slate-800/80 shadow-inner">
                       <p className="text-[10px] font-mono mb-3 text-indigo-500 tracking-widest font-bold uppercase">Mock API Integration</p>
                       <code className="text-[11px] block text-slate-400 break-all leading-relaxed font-mono">
                          const response = await fetch('https://api.sentinel.io/v1/dispatch', &#123;<br/>
                          &nbsp;&nbsp;method: 'POST',<br/>
                          &nbsp;&nbsp;body: JSON.stringify(&#123; type, description, priority &#125;)<br/>
                          &#125;);
                       </code>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <NotificationToast 
            title={toast.title}
            message={toast.message} 
            type={toast.type} 
            count={toast.count}
            onClose={() => setToast(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
