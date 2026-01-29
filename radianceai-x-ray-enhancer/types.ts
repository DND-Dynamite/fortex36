
export type ProcessingMode = 'gemini' | 'ollama' | 'manual';

export interface AnalysisResult {
  findings: string;
  summary: string;
  recommendations: string[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  exposure: number;
  sharpness: number;
  invert: boolean;
  sepia: boolean;
}

export interface ScanPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}


export interface SensorReading {
  timestamp: number;
  heartRate: number;
  spo2: number;
  bodyTemp: number;
  airQuality: number;
  systolic: number;
  diastolic: number;
  glucose: number;
  steps: number;
  sleepQuality: number;
  movementX: number;
  movementY: number;
  movementZ: number;
}

export interface LabResult {
  id: string;
  timestamp: number;
  parameter: string;
  value: string;
  unit: string;
  doctorNotes: string;
}

export interface UserProfile {
  name: string;
  role: UserRole;
  occupation: string;
  workLocation: string;
  age: number;
}

export interface Alert {
  id: string;
  timestamp: number;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  isRead: boolean;
  source?: string;
}

export interface AgentBaseline {
  hrRange: [number, number];
  bpNormal: string;
  tempBaseline: number;
  activityProfile: string;
}

export interface AgentAnomaly {
  score: number;
  method: string;
  flags: string[];
}

export interface AgentPattern {
  matchedCrisis: string;
  confidence: number;
  signatures: string[];
}

export interface AgentPrediction {
  score: number;
  timeToCritical: number;
  forecast: string;
}

export interface AgentEnvironment {
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: string[];
}

export interface AIAssessment {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  summary: string;
  agents: {
    baseline: AgentBaseline;
    anomaly: AgentAnomaly;
    pattern: AgentPattern;
    prediction: AgentPrediction;
    environment: AgentEnvironment;
  };
  recommendations: string[];
}

export interface DigitalTwinState {
  predictedHR: number;
  predictedBP: number;
  riskLevel: 'STABLE' | 'ELEVATED' | 'CRITICAL';
  simulationHorizon: string;
}

export interface RoutineTask {
  time: string;
  activity: string;
  reason: string;
}

export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  ALERTS = 'ALERTS',
  AI_INSIGHTS = 'AI_INSIGHTS',
  HARDWARE = 'HARDWARE',
  NEURAL_ANALYSIS = 'NEURAL_ANALYSIS',
  DIAGNOSTICS = 'DIAGNOSTICS',
  ROUTINE = 'ROUTINE',
  DATABASE_EXPLORER = 'DATABASE_EXPLORER'
}



export interface SensorReading {
  timestamp: number;
  heartRate: number;
  spo2: number;
  bodyTemp: number;
  airQuality: number;
  systolic: number;
  diastolic: number;
  glucose: number;
  steps: number;
  sleepQuality: number;
  movementX: number;
  movementY: number;
  movementZ: number;
}

export type UserRole = 'PATIENT' | 'DOCTOR' | 'GUEST';

export interface LabResult {
  id: string;
  timestamp: number;
  parameter: string;
  value: string;
  unit: string;
  doctorNotes: string;
}

export interface UserProfile {
  name: string;
  role: UserRole;
  occupation: string;
  workLocation: string;
  age: number;
}

export type CrisisScenario = 'NORMAL' | 'CARDIAC' | 'HEAT_EXHAUSTION' | 'FALL' | 'OVERDOSE' | 'STROKE' | 'INFECTION';

export interface Alert {
  id: string;
  timestamp: number;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  isRead: boolean;
  source?: string;
}

export interface AgentBaseline {
  hrRange: [number, number];
  bpNormal: string;
  tempBaseline: number;
  activityProfile: string;
}

export interface AgentAnomaly {
  score: number;
  method: string;
  flags: string[];
}

export interface AgentPattern {
  matchedCrisis: string;
  confidence: number;
  signatures: string[];
}

export interface AgentPrediction {
  score: number;
  timeToCritical: number;
  forecast: string;
}

export interface AgentEnvironment {
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: string[];
}

export interface AIAssessment {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  summary: string;
  agents: {
    baseline: AgentBaseline;
    anomaly: AgentAnomaly;
    pattern: AgentPattern;
    prediction: AgentPrediction;
    environment: AgentEnvironment;
  };
  recommendations: string[];
}

export interface DigitalTwinState {
  predictedHR: number;
  predictedBP: number;
  riskLevel: 'STABLE' | 'ELEVATED' | 'CRITICAL';
  simulationHorizon: string;
}

export interface RoutineTask {
  time: string;
  activity: string;
  reason: string;
}