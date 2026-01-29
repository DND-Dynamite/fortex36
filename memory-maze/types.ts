
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
