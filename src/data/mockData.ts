// Static mock data for textile wastewater monitoring system

export interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: { min?: number; max?: number; label: string };
  ranges: { min: number; max: number };
  status: 'compliant' | 'violation';
  lastUpdated: Date;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  ph: number;
  dissolvedOxygen: number;
  turbidity: number;
  conductivity: number;
  flowRate: number;
}

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

// Static sensor readings (demonstrating mix of compliant and non-compliant states)
export const getSensorReadings = (): SensorReading[] => {
  const now = new Date();

  return [
    {
      id: 'ph',
      name: 'pH Level',
      value: 7.2,
      unit: '',
      threshold: { min: 6.5, max: 8.5, label: '6.5 - 8.5' },
      ranges: { min: 0, max: 14 },
      status: 'compliant',
      lastUpdated: now,
    },
    {
      id: 'dissolvedOxygen',
      name: 'Dissolved Oxygen',
      value: 6.5,
      unit: 'mg/L',
      threshold: { min: 5, max: 8, label: '5 - 8' },
      ranges: { min: 0, max: 14 },
      status: 'compliant',
      lastUpdated: now,
    },
    {
      id: 'turbidity',
      name: 'Turbidity',
      value: 58,
      unit: 'NTU',
      threshold: { max: 50, label: '<= 50' },
      ranges: { min: 0, max: 100 },
      status: 'violation',
      lastUpdated: now,
    },
    {
      id: 'conductivity',
      name: 'Conductivity',
      value: 2100,
      unit: 'µS/cm',
      threshold: { max: 2500, label: '<= 2500' },
      ranges: { min: 0, max: 5000 },
      status: 'compliant',
      lastUpdated: now,
    },
    {
      id: 'flowRate',
      name: 'Flow Rate',
      value: 75,
      unit: 'm³/h',
      threshold: { max: 90, label: '<= 90' },
      ranges: { min: 0, max: 150 },
      status: 'compliant',
      lastUpdated: now,
    },
  ];
};

// Generate historical data for charts
export const getHistoricalData = (days: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  const pointsPerDay = 24; // One reading per hour

  for (let i = days * pointsPerDay; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourOfDay = timestamp.getHours();

    // Create realistic patterns
    const dayOffset = Math.sin((i / (pointsPerDay * 7)) * Math.PI * 2) * 0.3;
    const dailyCycle = Math.sin((hourOfDay / 24) * Math.PI * 2) * 0.2;

    data.push({
      timestamp,
      ph: 7.2 + dayOffset + dailyCycle + (Math.random() - 0.5) * 0.3,
      dissolvedOxygen:
        6.5 + dayOffset * 2 - dailyCycle + (Math.random() - 0.5) * 0.8,
      turbidity:
        35 + dayOffset * 10 + dailyCycle * 5 + (Math.random() - 0.5) * 5,
      conductivity:
        2100 + dayOffset * 200 + dailyCycle * 100 + (Math.random() - 0.5) * 150,
      flowRate:
        75 + dayOffset * 15 - dailyCycle * 10 + (Math.random() - 0.5) * 8,
    });
  }

  return data;
};

// AI Explanations - what's causing the sensor readings
export const getAIExplanations = (): AIExplanation[] => {
  return [
    {
      id: '1',
      sensor: 'Turbidity',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      value: 58,
      status: 'anomaly',
      factors: [
        {
          factor: 'Coagulant Efficiency',
          impact: 'high',
          description:
            'Polymer coagulant showing reduced flocculation performance, likely due to temperature variation in storage.',
        },
        {
          factor: 'Settling Tank Retention Time',
          impact: 'high',
          description:
            'Flow rate spike reduced settling time from 4.2 hours to 3.1 hours, insufficient for complete particle settling.',
        },
        {
          factor: 'Textile Fiber Content',
          impact: 'medium',
          description:
            'Increased synthetic fiber particles detected from polyester dyeing process.',
        },
      ],
    },
    {
      id: '2',
      sensor: 'pH Level',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      value: 7.2,
      status: 'normal',
      factors: [
        {
          factor: 'Alkali Dosing Rate',
          impact: 'medium',
          description:
            'Alkaline chemical dosing maintained at optimal levels, contributing to stable pH levels.',
        },
        {
          factor: 'Neutralization Tank Performance',
          impact: 'low',
          description:
            'Acid metering pump operating at 95% efficiency, maintaining target performance.',
        },
      ],
    },
    {
      id: '3',
      sensor: 'Dissolved Oxygen',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      value: 6.5,
      status: 'normal',
      factors: [
        {
          factor: 'Aeration System Performance',
          impact: 'high',
          description:
            'Blower system operating at 75% capacity, providing sufficient oxygen transfer.',
        },
        {
          factor: 'Biological Load',
          impact: 'medium',
          description:
            'Moderate organic load from textile wastewater maintains stable DO consumption rate.',
        },
      ],
    },
  ];
};

// AI Recommendations - what actions to take
export const getAIRecommendations = (): AIRecommendation[] => {
  return [
    {
      id: '1',
      sensor: 'Turbidity',
      priority: 'critical',
      issue:
        'Turbidity exceeding 50 NTU limit - Immediate regulatory violation',
      recommendation:
        'Optimize coagulation-flocculation and increase retention time',
      steps: [
        'Increase polyaluminum chloride (PAC) dosage from 80 ppm to 110 ppm',
        'Add anionic polymer flocculant at 2-3 ppm for enhanced particle bridging',
        'Reduce inlet flow rate by 18% to extend settling tank retention to 4.5 hours',
        'Inspect and clean lamella plate settlers to remove accumulated sludge',
        'Consider pH adjustment to 6.5-7.0 for optimal coagulation',
      ],
      estimatedImpact:
        'Turbidity reduction to 25-35 NTU expected within 6-8 hours. Prevents potential ₫50-150M regulatory fine.',
    },
    {
      id: '2',
      sensor: 'pH Level',
      priority: 'low',
      issue: 'pH stable and within optimal range - Maintain current operations',
      recommendation: 'Continue monitoring and maintain current dosing rates',
      steps: [
        'Maintain NaOH dosing rate at current level in dyeing preparation',
        'Keep H₂SO₄ metering pump at current speed in neutralization tank',
        'Continue pH monitoring with ±0.2 tolerance band',
        'Schedule routine calibration of pH sensors next week',
      ],
      estimatedImpact:
        'Maintain 95% compliance rate. Ensure continued regulatory adherence.',
    },
    {
      id: '3',
      sensor: 'Dissolved Oxygen',
      priority: 'medium',
      issue: 'DO levels stable but monitor during peak production periods',
      recommendation:
        'Maintain aeration capacity with scheduled preventive maintenance',
      steps: [
        'Keep aeration blower at 75% capacity during standard operations',
        'Inspect diffuser grid monthly for clogging',
        'Prepare backup aeration system for high-load periods',
        'Monitor biological oxygen demand (BOD) levels weekly',
      ],
      estimatedImpact:
        'Maintain DO above 6.0 mg/L consistently. Sustain biological treatment efficiency at 90%+.',
    },
    {
      id: '4',
      sensor: 'Conductivity',
      priority: 'low',
      issue:
        'Conductivity well below threshold - Good water recycling performance',
      recommendation: 'Optimize water recycling and maintain salt management',
      steps: [
        'Continue RO system operation at current recovery rate (78%)',
        'Maintain batch-wise salt segregation for high-salt dyeing processes',
        'Keep TDS monitoring in recycling tank below 1200 mg/L',
        'Continue bi-weekly membrane cleaning schedule for RO system',
      ],
      estimatedImpact:
        'Maintain conductivity below 2500 µS/cm. Sustain 12% freshwater consumption reduction.',
    },
    {
      id: '5',
      sensor: 'Flow Rate',
      priority: 'medium',
      issue: 'Flow rate within limits but optimize for treatment efficiency',
      recommendation:
        'Implement flow equalization for better treatment performance',
      steps: [
        'Consider implementing equalization tank with 4-hour retention capacity',
        'Install automated flow control valve for consistent discharge',
        'Maintain maximum discharge rate at 90 m³/h to prevent treatment overload',
        'Coordinate with production team on batch discharge scheduling',
      ],
      estimatedImpact:
        'Further stabilize treatment performance. Potential to reduce turbidity spikes by 40%.',
    },
  ];
};

// Blockchain audit trail (frontend display only)
export const getBlockchainTransactions = (): BlockchainTransaction[] => {
  const now = new Date();

  return [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000),
      type: 'alert',
      dataHash: '0x8a3f7c2d9e5b1a6f4c8d2e9a7b3f5c1d8e4a2b9c',
      blockNumber: 15847392,
      status: 'confirmed',
      description:
        'Turbidity violation detected - Level: 58 NTU (Limit: 50 NTU)',
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000),
      type: 'sensor_reading',
      dataHash: '0x7b2e8c1a4f9d3c6b5a8e2d7c9f4a1b6e8c3d5a2f',
      blockNumber: 15847380,
      status: 'confirmed',
      description: 'Hourly sensor data batch recorded - All 5 parameters',
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 35 * 60 * 1000),
      type: 'action_taken',
      dataHash: '0x9c4f2b7e1a8d3f6c5b9e2a7d4f1c8b6e3a5d2c9f',
      blockNumber: 15847355,
      status: 'confirmed',
      description:
        'Operator increased PAC dosage to 110 ppm per AI recommendation',
    },
    {
      id: '4',
      timestamp: new Date(now.getTime() - 65 * 60 * 1000),
      type: 'compliance_report',
      dataHash: '0x6e8a3c5f2b9d1e7a4c6f9b2e5a8d3c7f1b4e9a6c',
      blockNumber: 15847320,
      status: 'confirmed',
      description:
        'Daily compliance report generated - 80% compliant (4/5 parameters)',
    },
    {
      id: '5',
      timestamp: new Date(now.getTime() - 125 * 60 * 1000),
      type: 'sensor_reading',
      dataHash: '0x5d7b9e2a4c8f1b6e3a9c5d2f8b4e7a1c6f9b3e5a',
      blockNumber: 15847285,
      status: 'confirmed',
      description: 'Hourly sensor data batch recorded - All 5 parameters',
    },
    {
      id: '6',
      timestamp: new Date(now.getTime() - 2 * 60 * 1000),
      type: 'sensor_reading',
      dataHash: '0x2f9b4e7a1c5d8b3e6a9c2f5d7b8e4a1c6f3b9e5a',
      blockNumber: 15847398,
      status: 'pending',
      description: 'Current sensor readings pending blockchain confirmation',
    },
  ];
};
