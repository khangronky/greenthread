import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { HistoricalDataPoint, SensorType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const numDaysParam = searchParams.get('num_days');
    const numDays = numDaysParam ? parseInt(numDaysParam, 10) : 7; // Default to 7 days

    if (Number.isNaN(numDays) || numDays <= 0) {
      return NextResponse.json(
        { error: 'Invalid num_days parameter. Must be a positive integer.' },
        { status: 400 }
      );
    }

    // Calculate the timestamp for numDays ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    // Fetch historical sensor data from the database
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error fetching sensor data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the database records into the expected format
    // Group readings by timestamp and create data points
    const dataMap = new Map<string, HistoricalDataPoint>();

    for (const reading of data || []) {
      const timestamp = reading.recorded_at;

      if (!dataMap.has(timestamp)) {
        dataMap.set(timestamp, {
          timestamp,
          ph: null,
          dissolvedOxygen: null,
          turbidity: null,
          conductivity: null,
          flowRate: null,
          tds: null,
        });
      }

      const dataPoint = dataMap.get(timestamp)!;

      // Map database sensor types to frontend field names
      if (reading.type in dataPoint) {
        dataPoint[reading.type as SensorType] = reading.value;
      }
    }

    // Convert map to array and sort by timestamp
    const historicalData = Array.from(dataMap.values()).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return NextResponse.json(historicalData);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
