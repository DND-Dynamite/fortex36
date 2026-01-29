
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import HistoryChart from './components/HistoryChart';
import { Investigations } from './components/Investigations';
import { SqlExplorer } from './components/SqlExplorer';
import { sensorSimulator } from './services/sensorSimulator';
import { getLabPrediction, generateDailyRoutine } from './services/geminiService';
import { db } from './database/db';
import { agentBus } from './ai_agents/AgentBus';
import { initAgents } from './ai_agents/initAgents';
import { sensorAgent } from './ai_agents/SensorAgent';
import { 
  SensorReading, Alert, AIAssessment, View, CrisisScenario, 
  UserRole, LabResult, UserProfile, RoutineTask, DigitalTwinState 
} from './types';
import { THRESHOLDS, SENSOR_POLLING_INTERVAL, HISTORY_LIMIT } from './constants';

const hardwareFleet = [
  { name: 'CoreWatch S9', type: 'Biometric Wristband', battery: '88%' },
  { name: 'PulseLink V2', type: 'Chest Strap Monitor', battery: '92%' },
  { name: 'BioSense Pod', type: 'Continuous Glucose Monitor', battery: '74%' },
  { name: 'G-Stream Hub', type: 'Neural Bridge Gateway', battery: '100%' },
];

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.LOGIN);
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [aiAssessment, setAiAssessment] = useState<AIAssessment | null>(null);
  const [twinState, setTwinState] = useState<DigitalTwinState | null>(null);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labPrediction, setLabPrediction] = useState<string>('');
  const [routine, setRoutine] = useState<RoutineTask[]>([]);
  const [currentScenario, setCurrentScenario] = useState<CrisisScenario>('NORMAL');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
  const [diagTab, setDiagTab] = useState<'SENSOR' | 'LAB'>('SENSOR');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    role: 'PATIENT',
    occupation: '',
    workLocation: '',
    age: 30
  });

  const [newLabEntry, setNewLabEntry] = useState({ parameter: '', value: '', unit: '', notes: '' });

  // Initialize AI Agents and subscribe to system-wide events
  useEffect(() => {
    initAgents();
    
    // Subscribe to AI outcomes for the UI
    const unsubTwin = agentBus.subscribe<DigitalTwinState>('twin:state_updated', setTwinState);
    const unsubAlert = agentBus.subscribe<Alert>('ui:alert', (a) => {
        setAlerts(prev => {
            const updated = [a, ...prev];
            db.saveAlerts(updated);
            return updated;
        });
    });
    
    return () => {
      unsubTwin();
      unsubAlert();
    };
  }, []);

  // Load Initial Session Data from persistent Database
  useEffect(() => {
    const savedProfile = db.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setUserRole(savedProfile.role);
      setReadings(db.getReadings());
      setAlerts(db.getAlerts());
      setLabResults(db.getLabResults());
      setView(View.DASHBOARD);
    }
  }, []);

  // Core Data Acquisition Loop: Fetch simulated data -> Broadcast to AI -> Persist to DB -> Update UI
  useEffect(() => {
    if (userRole === 'GUEST') return;
    const interval = setInterval(() => {
      const newReading = sensorSimulator.getNextReading(currentScenario);
      
      // 1. Feed the multi-agent AI system via the broadcast agent
      sensorAgent.broadcast(newReading);
      
      // 2. Persist live reading to Database and update local reactive state
      setReadings(prev => {
        const updated = [...prev, newReading].slice(-HISTORY_LIMIT);
        // Persist to relational SQL DB
        db.saveReadings(updated);
        
        // Periodic batch emissions for agents requiring time-series history
        if (updated.length % 5 === 0) agentBus.emit('sensor:batch', updated);
        
        return updated;
      });

      // 3. Local hard-coded threshold safety checks
      checkThresholds(newReading);
    }, SENSOR_POLLING_INTERVAL);
    
    return () => clearInterval(interval);
  }, [currentScenario, userRole]);

  const checkThresholds = (r: SensorReading) => {
    const newAlerts: Alert[] = [];
    if (r.heartRate > THRESHOLDS.HEART_RATE.max) {
      newAlerts.push({ 
        id: Math.random().toString(36), 
        timestamp: Date.now(), 
        type: 'CRITICAL', 
        title: 'Cardiac Deviation', 
        message: `Pulse spike detected: ${r.heartRate.toFixed(0)} BPM. System logging to database.`, 
        isRead: false 
      });
    }
    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const updated = [...newAlerts, ...prev].slice(0, 50);
        db.saveAlerts(updated);
        return updated;
      });
    }
  };

  const handleLogin = (role: UserRole) => {
    if (!profile.name || !profile.occupation || !profile.workLocation) {
      alert("Please complete your profile details first to initialize the database.");
      return;
    }
    const finalProfile = { ...profile, role };
    setProfile(finalProfile);
    setUserRole(role);
    db.saveProfile(finalProfile);
    setView(View.DASHBOARD);
  };

  const handleLogout = () => {
    db.clear();
    setUserRole('GUEST');
    setView(View.LOGIN);
    setProfile({ name: '', role: 'PATIENT', occupation: '', workLocation: '', age: 30 });
    setReadings([]);
    setAlerts([]);
    setLabResults([]);
  };

  const addLabResult = () => {
    const res: LabResult = {
      id: Math.random().toString(36),
      timestamp: Date.now(),
      parameter: newLabEntry.parameter,
      value: newLabEntry.value,
      unit: newLabEntry.unit,
      doctorNotes: newLabEntry.notes
    };
    const updatedLabs = [res, ...labResults];
    setLabResults(updatedLabs);
    db.saveLabResults(updatedLabs);
    setNewLabEntry({ parameter: '', value: '', unit: '', notes: '' });
  };

  const analyzeLabData = async () => {
    if (labResults.length === 0) return;
    setIsAnalyzing(true);
    try {
      const pred = await getLabPrediction(labResults, currentReading);
      setLabPrediction(pred);
    } catch (e) { console.error(e); }
    finally { setIsAnalyzing(false); }
  };

  const fetchRoutine = async () => {
    setIsGeneratingRoutine(true);
    try {
      const tasks = await generateDailyRoutine(profile, aiAssessment);
      setRoutine(tasks);
    } catch (e) { console.error(e); }
    finally { setIsGeneratingRoutine(false); }
  };

  const currentReading: SensorReading = readings[readings.length - 1] || { 
    timestamp: Date.now(),
    heartRate: 0, 
    spo2: 0, 
    bodyTemp: 0, 
    airQuality: 0, 
    systolic: 0, 
    diastolic: 0, 
    glucose: 0,
    steps: 0,
    sleepQuality: 0,
    movementX: 0,
    movementY: 0,
    movementZ: 0
  };

  if (currentView === View.LOGIN) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1e1b4b,_#000000)]">
        <div className="w-full max-w-xl bg-gray-900/50 p-12 rounded-[4rem] border border-gray-800 backdrop-blur-2xl text-center shadow-2xl space-y-8">
          <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center mx-auto text-5xl text-indigo-500 shadow-inner">
            <i className="fa-solid fa-shield-heart"></i>
          </div>
          <div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter">SafetyNet</h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em] mt-2">Biometric Intelligence Portal</p>
          </div>
          
          <div className="space-y-4 text-left">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Identification & Work Profile</label>
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Occupation (e.g. Architect)" 
                className="flex-1 bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                value={profile.occupation}
                onChange={e => setProfile({...profile, occupation: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Work Location" 
                className="flex-1 bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                value={profile.workLocation}
                onChange={e => setProfile({...profile, workLocation: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button onClick={() => handleLogin('PATIENT')} className="p-8 bg-indigo-600 hover:bg-indigo-500 rounded-[2.5rem] flex flex-col items-center gap-4 group transition-all shadow-xl shadow-indigo-500/20">
              <i className="fa-solid fa-id-card text-3xl group-hover:scale-110 transition-transform"></i>
              <span className="font-black uppercase tracking-widest text-[11px]">Patient Login</span>
            </button>
            <button onClick={() => handleLogin('DOCTOR')} className="p-8 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-500 rounded-[2.5rem] flex flex-col items-center gap-4 group transition-all">
              <i className="fa-solid fa-user-doctor text-3xl group-hover:scale-110 transition-transform"></i>
              <span className="font-black uppercase tracking-widest text-[11px]">Doctor Command</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">SQLite Database Sync Enabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-gray-100 font-sans selection:bg-indigo-500/30">
      <Sidebar currentView={currentView} setView={setView} alertCount={alerts.length} userRole={userRole} onLogout={handleLogout} />
      
      <main className="flex-1 ml-64 p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111827,_#000000)] min-h-screen">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Authenticated Access</p>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">{currentView.replace('_', ' ')}</h2>
          </div>
          <div className="flex gap-4">
            {currentView === View.DASHBOARD && (
              <select onChange={(e) => {
                  setCurrentScenario(e.target.value as CrisisScenario);
                  sensorSimulator.resetScenario();
              }} className="bg-gray-800/80 border border-gray-700 px-6 py-3 rounded-2xl text-xs font-black uppercase outline-none focus:border-indigo-500">
                <option value="NORMAL">Scenario: Standard</option>
                <option value="CARDIAC">Scenario: Cardiac Crisis</option>
                <option value="FALL">Scenario: Accidental Fall</option>
                <option value="STROKE">Scenario: Neuro-Vascular</option>
                <option value="HEAT_EXHAUSTION">Scenario: Heat Exhaustion</option>
                <option value="INFECTION">Scenario: Infection Spike</option>
              </select>
            )}
            <button onClick={() => setAiAssessment(null)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20">Reset AI Insights</button>
          </div>
        </div>

        {currentView === View.DASHBOARD && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard label="Heart Rate" value={currentReading.heartRate.toFixed(1)} unit="BPM" icon="fa-heart-pulse" color="bg-rose-500/20 text-rose-500" threshold={THRESHOLDS.HEART_RATE}/>
              <StatCard label="Oxygen Level" value={currentReading.spo2.toFixed(1)} unit="%" icon="fa-wind" color="bg-cyan-500/20 text-cyan-500" threshold={THRESHOLDS.SPO2}/>
              <StatCard label="Blood Pressure" value={`${currentReading.systolic.toFixed(0)}/${currentReading.diastolic.toFixed(0)}`} unit="mmHg" icon="fa-gauge-high" color="bg-indigo-500/20 text-indigo-500" threshold={{max: 140}}/>
              <StatCard label="Glucose" value={currentReading.glucose.toFixed(0)} unit="mg/dL" icon="fa-droplet" color="bg-blue-500/20 text-blue-500" threshold={THRESHOLDS.GLUCOSE}/>
            </div>

            {/* Digital Twin Widget powered by persistent DB metrics */}
            {twinState && (
              <div className="bg-gray-900/60 p-8 rounded-[3rem] border border-indigo-500/30 flex items-center justify-between gap-10 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${twinState.riskLevel === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-500 text-white'}`}>
                    <i className="fa-solid fa-dna"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Digital Twin Projection ({twinState.simulationHorizon})</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Status: <span className={twinState.riskLevel === 'CRITICAL' ? 'text-rose-500' : 'text-emerald-500'}>{twinState.riskLevel}</span></p>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Simulated HR</p>
                    <p className="text-2xl font-black text-indigo-400">{twinState.predictedHR.toFixed(0)} BPM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Simulated BP</p>
                    <p className="text-2xl font-black text-indigo-400">{twinState.predictedBP.toFixed(0)} mmHg</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <HistoryChart data={readings} metric="heartRate" label="ECG Real-time Stream" color="#f43f5e" />
              <HistoryChart data={readings} metric="systolic" label="Hypertensive Velocity" color="#6366f1" />
            </div>
          </div>
        )}

        {currentView === View.DIAGNOSTICS && (
          <div className="space-y-10 animate-in slide-in-from-bottom-5">
            <div className="flex gap-4 p-2 bg-gray-900/40 rounded-3xl border border-gray-800 w-fit">
              <button 
                onClick={() => setDiagTab('SENSOR')}
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${diagTab === 'SENSOR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Sensor Detection Matrix
              </button>
              <button 
                onClick={() => setDiagTab('LAB')}
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${diagTab === 'LAB' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Lab Tests Synthesis
              </button>
            </div>

            {diagTab === 'SENSOR' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Body Temp" value={currentReading.bodyTemp.toFixed(1)} unit="°C" icon="fa-thermometer" color="bg-orange-500/20 text-orange-500" threshold={THRESHOLDS.BODY_TEMP}/>
                <StatCard label="AQI" value={currentReading.airQuality.toFixed(0)} unit="AQI" icon="fa-smog" color="bg-emerald-500/20 text-emerald-500" threshold={THRESHOLDS.AIR_QUALITY}/>
                <StatCard label="Sleep Efficiency" value={currentReading.sleepQuality.toFixed(0)} unit="%" icon="fa-moon" color="bg-purple-500/20 text-purple-500"/>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {userRole === 'DOCTOR' && (
                  <div className="lg:col-span-1 bg-gray-900/60 p-10 rounded-[3.5rem] border border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-8">Clinical Result Portal</h3>
                    <div className="space-y-6">
                      <input value={newLabEntry.parameter} onChange={e => setNewLabEntry({...newLabEntry, parameter: e.target.value})} placeholder="Biomarker" className="w-full bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none focus:border-indigo-500 text-sm font-medium" />
                      <div className="flex gap-4">
                        <input value={newLabEntry.value} onChange={e => setNewLabEntry({...newLabEntry, value: e.target.value})} placeholder="Val" className="flex-1 bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none text-sm font-medium" />
                        <input value={newLabEntry.unit} onChange={e => setNewLabEntry({...newLabEntry, unit: e.target.value})} placeholder="Unit" className="w-28 bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none text-sm font-medium" />
                      </div>
                      <textarea value={newLabEntry.notes} onChange={e => setNewLabEntry({...newLabEntry, notes: e.target.value})} placeholder="Clinical Observations..." className="w-full bg-black/50 border border-gray-800 p-5 rounded-3xl outline-none h-40 text-sm font-medium" />
                      <button onClick={addLabResult} className="w-full py-5 bg-rose-600 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-500/20">Commit to Database</button>
                    </div>
                  </div>
                )}
                <div className={userRole === 'DOCTOR' ? 'lg:col-span-2 space-y-8' : 'lg:col-span-3 space-y-8'}>
                    <button onClick={analyzeLabData} disabled={isAnalyzing || labResults.length === 0} className="px-10 py-4 bg-indigo-600 rounded-[2rem] font-black uppercase text-[10px] tracking-widest disabled:opacity-50 shadow-xl">Correlate Data Stream</button>
                    {labPrediction && <div className="p-10 bg-gray-900/40 border border-gray-800 rounded-[3rem] text-gray-300 italic whitespace-pre-line">{labPrediction}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {labResults.map(res => (
                            <div key={res.id} className="bg-gray-800/40 p-8 rounded-[2rem] border border-gray-700 flex justify-between items-start">
                                <div>
                                    <h4 className="font-black text-white uppercase text-lg">{res.parameter}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(res.timestamp).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-400 mt-4">&quot;{res.doctorNotes}&quot;</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-indigo-400">{res.value}</span>
                                    <span className="text-[10px] text-gray-500 uppercase ml-1">{res.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === View.DATABASE_EXPLORER && <SqlExplorer />}

        {currentView === View.NEURAL_ANALYSIS && <Investigations />}

        {currentView === View.ALERTS && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-700">
             {alerts.map(alert => (
              <div key={alert.id} className="bg-gray-900/50 p-10 rounded-[4rem] border border-gray-800 flex justify-between items-center group transition-all border-l-[20px] border-l-rose-600 shadow-2xl backdrop-blur-xl">
                <div className="flex gap-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-rose-600/20 text-rose-600 flex items-center justify-center text-4xl shadow-2xl"><i className="fa-solid fa-triangle-exclamation"></i></div>
                  <div>
                    <h4 className="font-black text-white text-3xl uppercase tracking-tighter mb-2">{alert.title}</h4>
                    <p className="text-gray-400 text-xl font-medium max-w-lg mb-6 leading-tight">{alert.message}</p>
                    <span className="text-[10px] font-black text-gray-500 uppercase bg-black px-6 py-3 rounded-2xl border border-gray-800 tracking-widest">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <button onClick={() => {
                  const updatedAlerts = alerts.filter(a => a.id !== alert.id);
                  setAlerts(updatedAlerts);
                  db.saveAlerts(updatedAlerts);
                }} className="text-gray-700 hover:text-rose-500 transition-colors p-6"><i className="fa-solid fa-circle-xmark text-5xl"></i></button>
              </div>
            ))}
            {alerts.length === 0 && <div className="text-center py-60 text-gray-800 font-black uppercase tracking-[0.3em] opacity-20 text-3xl">Monitoring Segment Stable</div>}
          </div>
        )}

        {currentView === View.ROUTINE && (
          <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="bg-gray-900/40 p-12 rounded-[4.5rem] border border-gray-800 flex flex-wrap gap-12 items-center justify-between shadow-2xl">
              <div className="flex gap-10 items-center">
                <div className="w-24 h-24 bg-emerald-600/10 rounded-[2.5rem] flex items-center justify-center text-5xl text-emerald-500 shadow-inner">
                  <i className="fa-solid fa-person-running"></i>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{profile.name}&apos;s Optimization Matrix</h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">{profile.occupation} • {profile.workLocation} • {profile.age} Years</p>
                </div>
              </div>
              <button onClick={fetchRoutine} disabled={isGeneratingRoutine} className="bg-emerald-600 hover:bg-emerald-500 px-12 py-5 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-4 transition-transform active:scale-95">
                <i className={`fa-solid fa-wand-magic-sparkles ${isGeneratingRoutine ? 'animate-spin' : ''}`}></i>
                {isGeneratingRoutine ? 'Orchestrating Routine...' : 'Recompute Daily Protocol'}
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                {routine.map((task, idx) => (
                    <div key={idx} className="bg-gray-900/60 p-10 rounded-[3.5rem] border border-gray-800 flex gap-10 items-center hover:bg-gray-800/60 transition-all border-l-[12px] border-l-emerald-500">
                      <div className="text-3xl font-black text-emerald-500 w-32 text-center pr-10 border-r border-gray-800">{task.time}</div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{task.activity}</h4>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed">{task.reason}</p>
                      </div>
                    </div>
                  ))}
                  {routine.length === 0 && <div className="text-center py-20 border-4 border-dashed border-gray-900 rounded-[3rem] text-gray-700 font-black uppercase tracking-widest">Awaiting Routine Generation</div>}
               </div>
               <div className="bg-indigo-600/10 p-12 rounded-[4.5rem] border border-indigo-500/30">
                 <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                  <i className="fa-solid fa-microchip-ai text-indigo-400"></i>
                  Clinical Summary
                 </h3>
                 <p className="text-gray-500 italic">Historical data from Database is required to sync neural summary context.</p>
               </div>
            </div>
          </div>
        )}

        {currentView === View.HISTORY && (
          <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="bg-gray-900/60 p-12 rounded-[4.5rem] border border-gray-800 flex items-center gap-12 shadow-2xl backdrop-blur-md">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center text-5xl text-indigo-500 shadow-inner"><i className="fa-solid fa-database"></i></div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Historical Acquisition Buffer</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Archiving last <span className="text-indigo-400 font-black">{HISTORY_LIMIT}</span> acquisition cycles.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12">
              <HistoryChart data={readings} metric="heartRate" label="ECG Core Pulse" color="#f43f5e" />
              <HistoryChart data={readings} metric="systolic" label="Hypertensive Gradient" color="#6366f1" />
            </div>
          </div>
        )}

        {currentView === View.HARDWARE && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-right-10 duration-700">
            {hardwareFleet.map((dev, i) => (
              <div key={i} className="bg-gray-900/40 p-12 rounded-[4rem] border border-gray-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-2xl">
                <div className="absolute -top-12 -right-12 text-white opacity-[0.03] text-[10rem] group-hover:scale-110 transition-transform"><i className={`fa-solid ${i === 0 ? 'fa-watch-apple' : i === 1 ? 'fa-heart-pulse' : i === 2 ? 'fa-droplet' : 'fa-gauge'}`}></i></div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{dev.name}</h3>
                <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em] border-b border-gray-800 pb-10 mb-10">{dev.type}</p>
                <div className="flex justify-between items-center bg-black/40 p-8 rounded-[2rem] border border-gray-800 shadow-inner">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Battery Pulse</span>
                  <span className="text-3xl font-black text-white">{dev.battery}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
