
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { RoundData, CognitiveAnalysis } from '../types';

interface AnalysisDashboardProps {
  rounds: RoundData[];
  analysis: CognitiveAnalysis | null;
  loading: boolean;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ rounds, analysis, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 animate-pulse font-medium">Generating AI Cognitive Insights...</p>
      </div>
    );
  }

  const chartData = rounds.map((r, i) => ({
    name: `Lvl ${r.level}`,
    time: r.responseTime,
  }));

  const radarData = analysis ? [
    { subject: 'Memory', A: analysis.memoryScore, fullMark: 100 },
    { subject: 'Focus', A: analysis.focusScore, fullMark: 100 },
    { subject: 'Processing', A: analysis.processingSpeed, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {analysis && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-blue-500">🧠</span> Cognitive Summary
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6 italic">"{analysis.summary}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700">Brain Training Tips:</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-orange-500">⏱️</span> Response Speed Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#f97316" 
                strokeWidth={3} 
                dot={{ r: 6, fill: '#f97316' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-slate-400 mt-4">Lower time indicates faster cognitive processing.</p>
      </div>

      <div className="text-xs text-slate-400 bg-slate-100 p-4 rounded-lg">
        <strong>Disclaimer:</strong> This application provides data for informational purposes only. It is not a clinical tool for diagnosing Alzheimer's, dementia, or any other medical condition. Please consult a healthcare professional for medical advice.
      </div>
    </div>
  );
};

export default AnalysisDashboard;
