
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
