
export interface ScanImage {
  id: string;
  url: string;
  name: string;
  timestamp: number;
  type: string;
  analysis?: MedicalReport;
}

export interface MedicalReport {
  patientInfo: {
    id: string;
    age: string;
    gender: string;
  };
  clinicalHistory: string;
  technique: string;
  findings: string;
  impression: string;
  recommendations: string[];
  status: 'pending' | 'completed' | 'error';
}

export interface ViewState {
  zoom: number;
  brightness: number;
  contrast: number;
  invert: boolean;
  rotation: number;
}
