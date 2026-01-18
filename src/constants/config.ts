import type { SensorType } from '@/types';

export const SENSOR_CONFIG: Record<
  SensorType,
  {
    id: string;
    name: string;
    unit: string;
    threshold: {
      min?: number;
      max?: number;
    };
    ranges: {
      min: number;
      max: number;
    };
  }
> = {
  ph: {
    id: 'ph',
    name: 'pH Level',
    unit: '',
    threshold: { min: 5.5, max: 8.5 },
    ranges: { min: 4, max: 11 },
  },
  dissolvedOxygen: {
    id: 'dissolvedOxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    threshold: { min: 5 },
    ranges: { min: 0, max: 15 },
  },
  turbidity: {
    id: 'turbidity',
    name: 'Turbidity',
    unit: 'NTU',
    threshold: { max: 50 },
    ranges: { min: 0, max: 100 },
  },
  conductivity: {
    id: 'conductivity',
    name: 'Conductivity',
    unit: 'µS/cm',
    threshold: { max: 3000 },
    ranges: { min: 0, max: 5000 },
  },
  flowRate: {
    id: 'flowRate',
    name: 'Flow Rate',
    unit: 'm³/h',
    threshold: { max: 100 },
    ranges: { min: 0, max: 150 },
  },
  tds: {
    id: 'tds',
    name: 'Total Dissolved Solids',
    unit: 'ppm',
    threshold: { max: 500 },
    ranges: { min: 0, max: 1000 },
  },
};
