import { NextResponse } from 'next/server';
import { SENSOR_CONFIG } from '@/constants/config';
import { createClient } from '@/lib/supabase/server';
import type { SensorType } from '@/types';
import {
  calculateStatus,
  formatThresholdLabel,
} from '@/utils/sensor-data-helper';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all sensor types
    const sensorTypes = Object.keys(SENSOR_CONFIG) as SensorType[];

    // Fetch latest reading for each sensor type
    const latestReadingsPromises = sensorTypes.map(async (type) => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .eq('type', type)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching ${type}:`, error);
        return null;
      }

      return data;
    });

    const latestReadings = await Promise.all(latestReadingsPromises);

    // Map to the expected response format
    const mappedSensors = sensorTypes.map((type, index) => {
      const config = SENSOR_CONFIG[type];
      const reading = latestReadings[index];

      return {
        id: config.id,
        name: config.name,
        value: reading?.value || null,
        unit: config.unit,
        lastUpdated: reading?.recorded_at || null,
        threshold: {
          min: config.threshold.min,
          max: config.threshold.max,
          label: formatThresholdLabel(config.threshold),
        },
        ranges: {
          min: config.ranges.min,
          max: config.ranges.max,
        },
        status: reading?.value
          ? calculateStatus(reading.value, config.threshold)
          : null,
      };
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
