import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type SensorType = Database['public']['Enums']['sensor_type'];

// Config mapping (same as used in mockData for consistency)
const SENSOR_CONFIG: Record<
  SensorType,
  {
    id: string;
    name: string;
    unit: string;
    threshold: {
      min?: number;
      max?: number;
      label: string;
    };
  }
> = {
  ph: {
    id: 'ph',
    name: 'pH Level',
    unit: '',
    threshold: { min: 5.5, max: 8.5, label: '5.5 - 8.5' },
  },
  dissolved_oxygen: {
    id: 'dissolvedOxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    threshold: { min: 5, label: '≥ 5 mg/L' },
  },
  turbidity: {
    id: 'turbidity',
    name: 'Turbidity',
    unit: 'NTU',
    threshold: { max: 50, label: '≤ 50 NTU' },
  },
  conductivity: {
    id: 'conductivity',
    name: 'Conductivity',
    unit: 'µS/cm',
    threshold: { max: 3000, label: '≤ 3000 µS/cm' },
  },
  flow_rate: {
    id: 'flowRate',
    name: 'Flow Rate',
    unit: 'm³/h',
    threshold: { max: 100, label: '≤ 100 m³/h' },
  },
};

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch the latest 50 records to ensure we cover all sensor types
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const latestReadings = new Map<SensorType, any>();

    // Iterate through data to find the latest reading for each type
    // Since data is ordered by recorded_at DESC, the first occurrence is the latest
    for (const reading of data || []) {
      if (!latestReadings.has(reading.type)) {
        latestReadings.set(reading.type, reading);
      }
    }

    const mappedSensors: any[] = [];

    (Object.keys(SENSOR_CONFIG) as SensorType[]).forEach((type) => {
      const config = SENSOR_CONFIG[type];
      const reading = latestReadings.get(type);

      if (reading) {
        let status = 'compliant';
        const val = reading.value;

        if (config.threshold.min !== undefined && val < config.threshold.min)
          status = 'violation';
        if (config.threshold.max !== undefined && val > config.threshold.max)
          status = 'violation';

        mappedSensors.push({
          id: config.id,
          name: config.name,
          value: val,
          unit: config.unit,
          threshold: config.threshold,
          status,
          lastUpdated: reading.recorded_at, // Send as string, frontend converts to Date if needed
        });
      }
    });

    return NextResponse.json(mappedSensors);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
