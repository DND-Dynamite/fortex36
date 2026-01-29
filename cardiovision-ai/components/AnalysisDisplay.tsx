
import React from 'react';
import { ECGAnalysisResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  result: ECGAnalysisResult;
}

const MetricCard: React.FC<{ label: string; value: string | number; unit?: string; sub?: string }> = ({ label, value, unit, sub }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    <div className="mt-1 flex items-baseline gap-1">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      {unit && <span className="text-sm text-slate-500">{unit}</span>}
    </div>
    {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
  </div>
);

const AnalysisDisplay: React.FC<Props> = ({ result }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Normal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Borderline': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Abnormal': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
          <p className="text-slate-500 text-sm">Automated clinical interpretation report</p>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${getSeverityColor(result.glasgowDiagnosis.severity)}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${result.glasgowDiagnosis.severity === 'Normal' ? 'bg-emerald-500' : result.glasgowDiagnosis.severity === 'Borderline' ? 'bg-amber-500' : 'bg-rose-500'}`} />
          {result.glasgowDiagnosis.severity} Diagnosis
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <MetricCard label="Heart Rate" value={result.heartRate} unit="BPM" />
        <MetricCard label="PR Interval" value={result.prInterval} unit="ms" sub="N: 120-200" />
        <MetricCard label="QRS Duration" value={result.qrsDuration} unit="ms" sub="N: <120" />
        <MetricCard label="QTc (Bazett)" value={result.qtcInterval} unit="ms" sub="N: <440" />
        <MetricCard label="QRS Axis" value={`${result.qrsAxis}°`} sub="N: -30 to +90" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Representative Morphological Waveform
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.waveformSimulation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip labelFormatter={() => 'Sample'} />
                  <Line type="monotone" dataKey="voltage" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Glasgow Clinical Interpretation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-bold text-slate-900">{result.glasgowDiagnosis.primaryDiagnosis}</p>
              </div>
              <ul className="space-y-2">
                {result.glasgowDiagnosis.secondaryFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Algorithm Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Pan-Tompkins (QRS)</span>
                  <span className="text-xs font-medium text-blue-600">Validated</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-800">Detected <strong>{result.panTompkinsFindings.qrsCount}</strong> QRS complexes. Rhythm is <strong>{result.panTompkinsFindings.isRegular ? 'Regular' : 'Irregular'}</strong>.</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Fuzzy Logic Classification</span>
                  <span className="text-xs font-medium text-blue-600">{(result.fuzzyLogicClassification.confidence * 100).toFixed(0)}% Conf.</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-sm font-bold text-indigo-900">{result.fuzzyLogicClassification.label}</p>
                  <p className="text-xs text-indigo-700 mt-1">{result.fuzzyLogicClassification.reasoning}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Physician Action</h3>
            <p className="text-sm text-slate-400 mb-4">Based on the {result.glasgowDiagnosis.severity} severity score:</p>
            <div className="space-y-3">
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-sm font-medium">
                Generate Referral
              </button>
              <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-sm font-medium">
                Add to Medical Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
