import { type NextRequest, NextResponse } from 'next/server';
import type { SensorType } from '@/constants/config';
import { SENSOR_CONFIG } from '@/constants/config';
import { createClient } from '@/lib/supabase/server';
import { calculateStatus } from '@/utils/sensor-data-helper';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'recorded_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const sensorType = searchParams.get('sensorType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json(
        { error: 'Invalid sort order. Must be "asc" or "desc"' },
        { status: 400 }
      );
    }

    // Map sortBy to database column names
    const sortByMap: Record<string, string> = {
      recorded_at: 'recorded_at',
      type: 'type',
      value: 'value',
      status: 'value', // We'll sort by value for status since it's calculated
    };

    const dbSortBy = sortByMap[sortBy] || 'recorded_at';

    // Build the query
    let query = supabase.from('sensor_data').select('*', { count: 'exact' });

    // Apply sensor type filter
    if (sensorType) {
      query = query.eq('type', sensorType);
    }

    // Apply date range filters
    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }

    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }

    // Apply sorting
    query = query.order(dbSortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const rangeStart = (page - 1) * pageSize;
    const rangeEnd = rangeStart + pageSize - 1;
    query = query.range(rangeStart, rangeEnd);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching sensor history:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to include calculated fields
    const transformedData = (data || []).map((reading) => {
      // Get sensor config based on type
      const config = SENSOR_CONFIG[reading.type as SensorType];

      // Calculate status based on thresholds
      const status = calculateStatus(reading.value, config.threshold);

      return {
        id: reading.id,
        type: reading.type,
        value: reading.value,
        unit: reading.unit,
        recorded_at: reading.recorded_at,
        status,
      };
    });

    // Calculate total pages
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    // Return response with data and pagination info
    return NextResponse.json({
      data: transformedData,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
