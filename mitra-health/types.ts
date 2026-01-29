
export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Checked-In';

export interface Patient {
  id: string;
  name: string;
  uhid: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType?: string;
  admittedDays?: number;
}

export interface Bed {
  id: string;
  number: string;
  status: 'Occupied' | 'Cleaning' | 'Available';
  patientName?: string;
  daysSinceAdmission?: number;
}

export interface LabOrder {
  id: string;
  testName: string;
  patientName: string;
  status: 'Ordered' | 'Sample-Collected' | 'In-Process' | 'Results-Ready';
  requestTime: string;
}

export interface QueueItem {
  id: string;
  doctorName: string;
  nowConsulting: string;
  next3: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  batch: string;
  expiry: string;
  stock: number;
  isAsset: boolean;
}

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  status: 'Pending' | 'Dispensed' | 'Out-of-Stock';
  isUrgent: boolean;
}


export interface ECGAnalysisResult {
  heartRate: number;
  prInterval: number; // in ms
  qrsDuration: number; // in ms
  qtInterval: number; // in ms
  qtcInterval: number; // in ms
  pAxis: number;
  qrsAxis: number;
  tAxis: number;
  interpretation: string;
  panTompkinsFindings: {
    qrsCount: number;
    rrIntervals: number[];
    isRegular: boolean;
  };
  fuzzyLogicClassification: {
    label: string;
    confidence: number;
    reasoning: string;
  };
  glasgowDiagnosis: {
    primaryDiagnosis: string;
    secondaryFindings: string[];
    severity: 'Normal' | 'Borderline' | 'Abnormal';
  };
  waveformSimulation?: { time: number; voltage: number }[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  exposure: number;
  sharpness: number;
  invert: boolean;
  sepia: boolean;
}

export type ProcessingMode = 'gemini' | 'ollama' | 'manual';

export interface AnalysisResult {
  severity: 'critical' | 'high' | 'moderate' | 'low' | 'normal';
  confidence: number;
  findings: string;
  summary: string;
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



export enum GameStatus {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  SHOWING = 'SHOWING',
  INPUTTING = 'INPUTTING',
  SUCCESS = 'SUCCESS',
  GAMEOVER = 'GAMEOVER'
}

export interface RoundData {
  level: number;
  sequenceLength: number;
  responseTime: number; // average time per tap in ms
  success: boolean;
}

export interface CognitiveAnalysis {
  summary: string;
  focusScore: number;
  memoryScore: number;
  processingSpeed: number;
  recommendations: string[];
}
