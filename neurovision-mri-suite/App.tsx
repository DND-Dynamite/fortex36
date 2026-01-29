
import React, { useState, useCallback } from 'react';
import { ScanImage, ViewState, MedicalReport } from './types';
import Viewer from './components/Viewer';
import ReportPanel from './components/ReportPanel';
import { generateMedicalReport } from './services/geminiService';
import { 
  Upload, 
  RotateCcw, 
  Sun, 
  Contrast, 
  Layers, 
  Search, 
  Brain,
  Plus,
  Minus,
  Trash2,
  Settings2,
  Scan,
  Activity
} from 'lucide-react';

const INITIAL_VIEW_STATE: ViewState = {
  zoom: 1,
  brightness: 100,
  contrast: 100,
  invert: false,
  rotation: 0
};

const DEFAULT_SCANS: ScanImage[] = [
  {
    id: 'scan-1',
    name: 'T1_AXIAL_BRAIN.png',
    url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop', 
    timestamp: Date.now(),
    type: 'T1 Axial'
  },
  {
    id: 'scan-2',
    name: 'FLAIR_SAGITTAL.png',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop',
    timestamp: Date.now(),
    type: 'FLAIR Sagittal'
  }
];

export default function App() {
  const [scans, setScans] = useState<ScanImage[]>(DEFAULT_SCANS);
  const [activeScanId, setActiveScanId] = useState<string>(DEFAULT_SCANS[0].id);
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const activeScan = scans.find(s => s.id === activeScanId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newScan: ScanImage = {
          id: Math.random().toString(36).substring(2, 11),
          name: file.name,
          url: event.target?.result as string,
          timestamp: Date.now(),
          type: 'Uploaded Slice'
        };
        setScans(prev => [newScan, ...prev]);
        setActiveScanId(newScan.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateViewState = (updates: Partial<ViewState>) => {
    setViewState(prev => ({ ...prev, ...updates }));
  };

  const runAnalysis = async () => {
    if (!activeScan) return;
    setIsAnalyzing(true);
    try {
      const report = await generateMedicalReport(activeScan.url);
      setScans(prev => prev.map(s => 
        s.id === activeScanId ? { ...s, analysis: report } : s
      ));
    } catch (err) {
      console.error(err);
      alert("Analysis engine error. Please check connectivity or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeScan = (id: string) => {
    setScans(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (activeScanId === id && filtered.length > 0) {
        setActiveScanId(filtered[0].id);
      }
      return filtered;
    });
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans select-none">
      {/* LEFT SIDEBAR: Scan Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/80 flex flex-col shrink-0 backdrop-blur-md">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white">NeuroVision</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">AI CORE v3.0</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <label className="group flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-700 border-dashed hover:border-blue-500/50 cursor-pointer transition-all bg-slate-800/20 hover:bg-slate-800/50">
            <Upload className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200">Import DICOM/Image</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-10">
          <div className="px-2 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center justify-between">
            Series Explorer
            <Layers className="w-3 h-3" />
          </div>
          {scans.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-xs text-slate-600 italic">No scans loaded in current session.</p>
            </div>
          ) : (
            scans.map(scan => (
              <div
                key={scan.id}
                onClick={() => setActiveScanId(scan.id)}
                className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                  activeScanId === scan.id 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 ring-1 ring-blue-500/20' 
                  : 'bg-transparent border-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-lg border border-slate-700/50 overflow-hidden shrink-0 bg-black relative">
                  <img src={scan.url} alt="slice" className={`w-full h-full object-cover ${activeScanId === scan.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-70'}`} />
                  {scan.analysis && (
                    <div className="absolute top-0 right-0 p-0.5 bg-blue-500 rounded-bl-lg">
                      <Activity className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{scan.name}</p>
                  <p className="text-[9px] font-mono opacity-50 uppercase mt-0.5 tracking-tighter">
                    {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {scan.type}
                  </p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeScan(scan.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* CENTER: MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col relative bg-slate-950">
        {/* HEADER TOOLBAR */}
        <header className="h-14 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between px-6 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-lg p-1">
              <button 
                onClick={() => updateViewState({ zoom: Math.max(0.1, viewState.zoom - 0.2) })}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="px-3 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-mono w-10 text-center text-slate-300">{Math.round(viewState.zoom * 100)}%</span>
              </div>
              <button 
                onClick={() => updateViewState({ zoom: Math.min(5, viewState.zoom + 0.2) })}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-slate-500" />
                <input 
                  type="range" min="0" max="200" value={viewState.brightness} 
                  onChange={(e) => updateViewState({ brightness: parseInt(e.target.value) })}
                  className="w-24 accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3">
                <Contrast className="w-4 h-4 text-slate-500" />
                <input 
                  type="range" min="0" max="200" value={viewState.contrast} 
                  onChange={(e) => updateViewState({ contrast: parseInt(e.target.value) })}
                  className="w-24 accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => updateViewState({ invert: !viewState.invert })}
              className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-xs font-semibold ${
                viewState.invert 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Invert"
            >
              <Settings2 className="w-4 h-4" />
              Invert
            </button>
            <button 
              onClick={() => updateViewState({ rotation: (viewState.rotation + 90) % 360 })}
              className="p-2 bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-lg transition-all"
              title="Rotate 90°"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewState(INITIAL_VIEW_STATE)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
            >
              Reset
            </button>
          </div>
        </header>

        {/* VIEWPORT AREA */}
        <div className="flex-1 bg-black p-4 relative overflow-hidden">
          {activeScan ? (
            <Viewer 
              imageUrl={activeScan.url} 
              viewState={viewState} 
              onUpdateViewState={updateViewState} 
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-900 rounded-2xl">
              <Scan className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm font-medium">Select a scan sequence from the sidebar</p>
            </div>
          )}
        </div>

        {/* HUD FOOTER */}
        <footer className="h-10 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-[0.1em]">
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <span className="text-slate-700">COORD:</span>
              <span className="text-cyan-500/70">X: 000 | Y: 000 | Z: 042</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-slate-700">WINDOW:</span>
              <span className="text-slate-400">WL: 400 | WW: 1500</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-slate-700 font-bold">STATUS: READY</span>
             <div className="w-2 h-2 rounded-full bg-cyan-500" />
          </div>
        </footer>
      </main>

      {/* RIGHT PANEL: AI Report */}
      <ReportPanel 
        report={activeScan?.analysis} 
        isAnalyzing={isAnalyzing} 
        onAnalyze={runAnalysis} 
      />
    </div>
  );
}
