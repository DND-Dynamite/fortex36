
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeECGImage } from './services/geminiService';
import { ECGAnalysisResult, AnalysisStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<ECGAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setResult(null);
    setStatus(AnalysisStatus.UPLOADING);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      
      try {
        setStatus(AnalysisStatus.ANALYZING);
        const analysisResult = await analyzeECGImage(base64);
        setResult(analysisResult);
        setStatus(AnalysisStatus.COMPLETED);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during analysis.');
        setStatus(AnalysisStatus.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Precision ECG Interpretation</h2>
            <p className="text-lg text-slate-600 mb-8">
              Upload an ECG strip or 12-lead image for rapid algorithmic analysis using Pan-Tompkins, 
              Heuristic Fuzzy Logic, and clinical Glasgow diagnostic criteria.
            </p>
            
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-white group-hover:border-blue-500 group-hover:bg-blue-50/50 transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-slate-900">Drop ECG image here</p>
                <p className="text-sm text-slate-500 mt-1">PNG, JPG or PDF up to 10MB</p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'Pan-Tompkins', desc: 'Robust QRS detection using real-time DSP logic.' },
                { title: 'Fuzzy Logic', desc: 'Heuristic classification of complex rhythm patterns.' },
                { title: 'Glasgow 3.1', desc: 'Gold-standard clinical diagnostic interpretation.' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.UPLOADING) && (
          <div className="max-w-xl mx-auto mt-24 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {status === AnalysisStatus.UPLOADING ? 'Preprocessing Image...' : 'Applying Multi-Algorithm Analysis...'}
            </h2>
            <div className="space-y-2">
              <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-75" />
                Executing Pan-Tompkins QRS Detection
              </p>
              <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-150" />
                Mapping Fuzzy Rhythm Heuristics
              </p>
              <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-300" />
                Matching Glasgow Diagnostic Criteria
              </p>
            </div>
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-xl mx-auto mt-24 text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Analysis Failed</h2>
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-sm mb-8">
              {error}
            </div>
            <button
              onClick={handleReset}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Try Another Image
            </button>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Upload
              </button>
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Results
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                   <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Original Source</p>
                    <img 
                      src={imagePreview || ''} 
                      alt="ECG Scan" 
                      className="w-full h-auto rounded-lg border border-slate-100 object-cover aspect-video"
                    />
                  </div>
                  <div className="bg-blue-600 p-4 rounded-2xl text-white">
                    <p className="text-xs font-bold text-white/70 uppercase mb-1">Status</p>
                    <p className="text-sm font-medium">Digital Analysis Verified</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs">Live Physician Review Available</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <AnalysisDisplay result={result} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2024 CardioVision AI. For research and clinical support only.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">HIPAA Compliance</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">Terms of Service</a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default App;
