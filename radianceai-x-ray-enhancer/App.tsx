
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Scan, 
  Activity, 
  FileText, 
  ChevronRight, 
  AlertCircle, 
  RefreshCcw, 
  ZoomIn, 
  Download, 
  Cpu, 
  Cloud, 
  SlidersHorizontal,
  Save,
  FolderOpen,
  Trash2,
  Clock
} from 'lucide-react';
import { analyzeXRay } from './services/geminiService';
import { analyzeWithOllama } from './services/ollamaService';
import { saveToArchive, getArchive, deleteFromArchive, SavedScan } from './services/storageService';
import Toolbar from './components/Toolbar';
import { AnalysisResult, ImageFilters, ProcessingMode } from './types';

const INITIAL_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  exposure: 100,
  sharpness: 0,
  invert: false,
  sepia: false,
};

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [filters, setFilters] = useState<ImageFilters>(INITIAL_FILTERS);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ProcessingMode>('gemini');
  const [activeTab, setActiveTab] = useState<'controls' | 'archive'>('controls');
  const [archive, setArchive] = useState<SavedScan[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load archive on mount
  useEffect(() => {
    refreshArchive();
  }, []);

  const refreshArchive = async () => {
    try {
      const data = await getArchive();
      setArchive(data);
    } catch (e) {
      console.error("Archive error", e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setError(null);
        setActiveTab('controls');
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) ${filters.invert ? 'invert(1)' : ''}`;
      ctx.drawImage(img, 0, 0);
    };
  }, [image, filters]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleAnalyze = async () => {
    if (!image || mode === 'manual') return;
    setAnalyzing(true);
    setError(null);
    try {
      let analysis: AnalysisResult;
      if (mode === 'gemini') {
        analysis = await analyzeXRay(image);
      } else {
        analysis = await analyzeWithOllama(image);
      }
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToArchive = async () => {
    if (!image) return;
    try {
      setSaveStatus('Saving...');
      await saveToArchive({
        image,
        result,
        filters,
        name: `Scan_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`
      });
      await refreshArchive();
      setSaveStatus('Saved to Folder');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      setSaveStatus('Error saving');
    }
  };

  const loadFromArchive = (scan: SavedScan) => {
    setImage(scan.image);
    setResult(scan.result);
    setFilters(scan.filters);
    setActiveTab('controls');
  };

  const handleDeleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteFromArchive(id);
    refreshArchive();
  };

  const downloadEnhanced = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'enhanced-xray.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">RADIANCEX AI</h1>
            <p className="text-[10px] text-zinc-500 mono uppercase">Diagnostic Support Systems v3.0</p>
          </div>
        </div>

        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-inner">
          <button onClick={() => setMode('gemini')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${mode === 'gemini' ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Cloud className="w-3.5 h-3.5" /> Gemini
          </button>
          <button onClick={() => setMode('ollama')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${mode === 'ollama' ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Cpu className="w-3.5 h-3.5" /> Ollama
          </button>
          <button onClick={() => setMode('manual')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${mode === 'manual' ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Manual
          </button>
        </div>

        <div className="flex items-center gap-4">
          {image && mode !== 'manual' && (
            <button onClick={handleAnalyze} disabled={analyzing} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${analyzing ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]'}`}>
              {analyzing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {analyzing ? 'Processing...' : `Run Analysis`}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation & Archive */}
        <aside className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
          <div className="flex border-b border-zinc-800">
            <button onClick={() => setActiveTab('controls')} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'controls' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>
              Controls
            </button>
            <button onClick={() => setActiveTab('archive')} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'archive' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>
              Archive Folder ({archive.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'controls' ? (
              <div className="space-y-6">
                {!image ? (
                  <div className="p-4 border-2 border-dashed border-zinc-800 rounded-xl hover:border-blue-500 transition-colors group">
                    <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">
                      <Upload className="w-8 h-8 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-zinc-400">Upload DICOM/PNG/JPG</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Toolbar filters={filters} onChange={setFilters} onReset={() => setFilters(INITIAL_FILTERS)} />
                    <button onClick={() => { setImage(null); setResult(null); setError(null); }} className="w-full py-2 border border-zinc-800 rounded-lg text-xs text-zinc-500 hover:text-white transition-colors">
                      Discard Current
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {archive.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-zinc-600">
                    <FolderOpen className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-xs italic tracking-tight">Folder is empty</p>
                  </div>
                ) : (
                  archive.map(scan => (
                    <div key={scan.id} onClick={() => loadFromArchive(scan)} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg p-2 cursor-pointer hover:border-blue-500/50 transition-all">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-black rounded border border-zinc-800 overflow-hidden flex-shrink-0">
                          <img src={scan.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Scan thumbnail" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-zinc-200 truncate mb-1">{scan.name}</p>
                          <div className="flex items-center gap-2 text-[9px] text-zinc-500 mono">
                            <Clock className="w-3 h-3" /> {new Date(scan.timestamp).toLocaleDateString()}
                          </div>
                          {scan.result && (
                            <span className={`mt-2 inline-block px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-widest ${
                              scan.result.severity === 'critical' ? 'bg-red-900/40 text-red-400' : 'bg-blue-900/40 text-blue-400'
                            }`}>
                              {scan.result.severity}
                            </span>
                          )}
                        </div>
                        <button onClick={(e) => handleDeleteScan(scan.id, e)} className="absolute top-2 right-2 p-1.5 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Center Viewport */}
        <div className="flex-1 bg-zinc-900/30 flex flex-col relative overflow-hidden">
          {image ? (
            <>
              <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                <div className="relative max-w-full max-h-full shadow-2xl shadow-blue-500/10 border border-zinc-800 overflow-hidden bg-black">
                  <canvas ref={canvasRef} className="max-w-full max-h-[calc(100vh-16rem)] object-contain transition-transform duration-300" />
                  {analyzing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-[loading_2s_infinite]" />
                        </div>
                        <span className="text-sm font-medium tracking-widest text-blue-400 uppercase">Analysis in progress</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-12 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between px-4">
                <div className="flex gap-4">
                  <button className="p-1.5 text-zinc-400 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={handleSaveToArchive} className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${saveStatus ? 'text-green-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                    {saveStatus ? <Activity className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
                    {saveStatus || 'Save to Archive Folder'}
                  </button>
                  <button onClick={downloadEnhanced} className="p-1.5 text-zinc-400 hover:text-white"><Download className="w-4 h-4" /></button>
                </div>
                <div className="text-[10px] text-zinc-600 font-mono flex gap-4 uppercase">
                  <span>Pipeline: {mode}</span>
                  <span>Status: Operational</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                <Scan className="w-10 h-10 text-zinc-600" />
              </div>
              <h2 className="text-2xl font-light text-zinc-400 mb-2">Diagnostic Workbench Ready</h2>
              <p className="text-zinc-600 max-w-md text-sm">Choose a processing engine and upload scan files to start.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Analysis */}
        <aside className="w-96 border-l border-zinc-800 bg-zinc-950 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Radiology Report</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg flex flex-col gap-2 mb-6">
              <p className="text-xs text-red-400 leading-tight font-bold">Error: {mode === 'ollama' ? 'Connection Refused' : 'API Failure'}</p>
              <p className="text-[10px] text-red-300/60 leading-tight">{error}</p>
            </div>
          )}

          {!result ? (
            <div className="flex flex-col items-center justify-center h-64 border border-zinc-800 border-dashed rounded-xl text-center p-6">
              <p className="text-xs text-zinc-600 italic">
                {analyzing ? 'Analysis in progress...' : 'Pending Image Analysis...'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Severity Index</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    result.severity === 'critical' ? 'bg-red-900/50 text-red-400' :
                    result.severity === 'high' ? 'bg-orange-900/50 text-orange-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {result.severity}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${result.severity === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(result.confidence * 100).toFixed(0)}%` }} />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-zinc-200 mb-2 flex items-center gap-2 uppercase">Findings</h3>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">{result.findings}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-zinc-200 mb-2 uppercase">Impressions</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{result.summary}</p>
              </section>

              <button className="w-full py-3 bg-zinc-100 text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2">
                Export Formal Report <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
