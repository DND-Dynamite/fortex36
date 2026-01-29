import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { Activity, Heart, Thermometer, Droplets } from 'lucide-react';

interface PatientData {
  patient_id: string;
  vitals: {
    heart_rate: number;
    spo2: number;
    temp: number;
  };
  status: string;
  timestamp: number;
}

const HealthDashboard = () => {
  const [patients, setPatients] = useState<{ [key: string]: PatientData }>({});
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // 1. Connection Options
    // For HiveMQ Cloud, use 'wss://' and port 8884
    // For Public Broker, use 'ws://' and port 8000
    const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

    client.on('connect', () => {
      setStatus('Connected to Health Monitor');
      // Subscribe to all patient vitals using wildcard '+'
      client.subscribe('health/monitor/+/vitals');
    });

    client.on('message', (topic, message) => {
      const data: PatientData = JSON.parse(message.toString());
      setPatients((prev) => ({
        ...prev,
        [data.patient_id]: data,
      }));
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="text-red-500" /> Patient Vitals Real-Time Dashboard
        </h1>
        <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
          {status}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(patients).map((patient) => (
          <div 
            key={patient.patient_id} 
            className={`p-6 rounded-xl border ${
              patient.status === 'Danger' ? 'bg-red-950 border-red-500 animate-pulse' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{patient.patient_id}</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                patient.status === 'Danger' ? 'bg-red-600' : 'bg-green-600'
              }`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400"><Heart size={18}/> BPM</div>
                <div className="text-2xl font-mono text-red-400">{patient.vitals.heart_rate}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400"><Droplets size={18}/> SpO2</div>
                <div className="text-2xl font-mono text-blue-400">{patient.vitals.spo2}%</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400"><Thermometer size={18}/> Temp</div>
                <div className="text-2xl font-mono text-yellow-400">{patient.vitals.temp}°C</div>
              </div>
            </div>
            
            <div className="mt-4 text-[10px] text-slate-500 text-right">
              Last Update: {new Date(patient.timestamp * 1000).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthDashboard;