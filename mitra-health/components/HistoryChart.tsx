
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { SensorReading } from '../types';

interface HistoryChartProps {
  data: SensorReading[];
  metric: keyof SensorReading;
  label: string;
  color: string;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data, metric, label, color }) => {
  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-80">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
        {label} Trends
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            itemStyle={{ color: '#f9fafb' }}
          />
          <Area 
            type="monotone" 
            dataKey={metric} 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={`url(#gradient-${metric})`} 
            dot={false}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
