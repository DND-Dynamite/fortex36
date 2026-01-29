
import { BaselineLearnerAgent } from './BaselineLearnerAgent';
import { AnomalyDetectorAgent } from './AnomalyDetectorAgent';
import { PatternMatcherAgent } from './PatternMatcherAgent';
import { PredictiveRiskAgent } from './PredictiveRiskAgent';
import { DigitalTwinAgent } from './DigitalTwinAgent';

export function initAgents() {
  const agents = [
    new BaselineLearnerAgent(),
    new AnomalyDetectorAgent(),
    new PatternMatcherAgent(),
    new PredictiveRiskAgent(),
    new DigitalTwinAgent()
  ];

  agents.forEach(agent => agent.init());
  console.log('SafetyNet AI Orchestration Layer Initialized.');
}
