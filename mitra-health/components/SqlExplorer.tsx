
import React, { useState, useEffect } from 'react';
import { db } from '../database/db';

export const SqlExplorer: React.FC = () => {
  const [query, setQuery] = useState("SELECT * FROM readings ORDER BY timestamp DESC LIMIT 10");
  const [results, setResults] = useState<any[]>([]);
  const [tables, setTables] = useState<string[]>(['readings', 'alerts', 'lab_results', 'profile']);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async () => {
    setError(null);
    try {
      const res = await db.query(query);
      setResults(res);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    runQuery();
    // Refresh live data every 5 seconds if viewing readings
    const interval = setInterval(() => {
        if (query.includes('readings')) runQuery();
    }, 5000);
    return () => clearInterval(interval);
  }, [query]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <div className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl text-indigo-400 shadow-inner">
                <i className="fa-solid fa-database"></i>
            </div>
            <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Live SQLite Explorer</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Interactive SQL Console for SafetyNet DB</p>
            </div>
        </div>

        <div className="flex gap-4 mb-6">
            {tables.map(t => (
                <button 
                    key={t}
                    onClick={() => setQuery(`SELECT * FROM ${t} LIMIT 10`)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 transition-all text-gray-400 hover:text-white"
                >
                    {t}
                </button>
            ))}
        </div>

        <div className="relative mb-6">
            <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-32 bg-black border border-gray-800 p-6 rounded-[2rem] font-mono text-sm text-indigo-400 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                spellCheck={false}
            />
            <button 
                onClick={runQuery}
                className="absolute bottom-6 right-6 px-6 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30"
            >
                Execute
            </button>
        </div>

        {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold uppercase mb-6">
                SQL Error: {error}
            </div>
        )}

        <div className="overflow-x-auto rounded-[2rem] border border-gray-800 bg-black/40">
            {results.length > 0 ? (
                results.map((res, i) => (
                    <table key={i} className="w-full text-left text-[11px] font-medium border-collapse">
                        <thead className="bg-gray-800/50">
                            <tr>
                                {res.columns.map((col: string) => (
                                    <th key={col} className="p-4 border-b border-gray-800 text-gray-500 uppercase font-black tracking-widest">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {res.values.map((row: any[], ri: number) => (
                                <tr key={ri} className="hover:bg-indigo-500/5 transition-colors border-b border-gray-800 last:border-0">
                                    {row.map((val: any, ci: number) => (
                                        <td key={ci} className="p-4 text-gray-300">
                                            {typeof val === 'string' && val.startsWith('{') ? (
                                                <span className="text-emerald-400 font-mono text-[9px] truncate block max-w-xs">{val}</span>
                                            ) : (
                                                val?.toString()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))
            ) : (
                <div className="py-20 text-center text-gray-600 font-black uppercase tracking-widest text-xs">
                    No results found or invalid query execution.
                </div>
            )}
        </div>
      </div>
      
      <div className="bg-indigo-600/10 p-10 rounded-[4rem] border border-indigo-500/20">
        <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Database Schema Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-gray-400 font-bold leading-relaxed">
            <div className="space-y-2">
                <p className="text-white uppercase tracking-tighter text-base">READINGS TABLE</p>
                <p>Stores live telemetry cycles including HR, SpO2, Temp, and XYZ motion data. Primary key is timestamp.</p>
            </div>
            <div className="space-y-2">
                <p className="text-white uppercase tracking-tighter text-base">ALERTS TABLE</p>
                <p>Stores critical system events. Mapped to the dashboard crisis log view.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
