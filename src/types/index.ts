export type SensorType =
  | 'temperature'
  | 'ph'
  | 'dissolvedOxygen'
  | 'turbidity'
  | 'conductivity'
  | 'flowRate'
  | 'tds';

export interface SensorReading {
  id: string;
  name: string;
  value: number | null;
  unit: string;
  threshold: { min?: number; max?: number; label: string };
  ranges: { min: number; max: number };
  status: 'compliant' | 'violation' | null;
  lastUpdated: Date | null;
}

export type HistoricalDataPoint = {
  timestamp: string;
} & Record<SensorType, number | null>;

export interface AIExplanation {
  id: string;
  sensor: string;
  timestamp: Date;
  value: number;
  status: 'normal' | 'anomaly';
  factors: {
    factor: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface AIRecommendation {
  id: string;
  sensor: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
  steps: string[];
  estimatedImpact: string;
}

export interface BlockchainTransaction {
  id: string;
  timestamp: Date;
  type: 'sensor_reading' | 'compliance_report' | 'alert' | 'action_taken';
  dataHash: string;
  blockNumber: number;
  status: 'confirmed' | 'pending';
  description: string;
}
