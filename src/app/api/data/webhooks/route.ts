import { type NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { webhookPayloadSchema } from '@/lib/schema/sensor';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret');

    if (!webhookSecret || webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const rawPayload = await request.json();

    // Validate payload with Zod schema
    const validationResult = webhookPayloadSchema.safeParse(rawPayload);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: 'Invalid payload format',
          details: errors,
        },
        { status: 400 }
      );
    }

    const { data } = validationResult.data;

    // Normalize data to always be an array
    const readings = Array.isArray(data) ? data : [data];

    // Use admin client to bypass RLS policies
    const supabase = await createAdminClient();

    // Insert data into sensor_data table
    const { data: insertedData, error: insertError } = await supabase
      .from('sensor_data')
      .insert(readings)
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save sensor data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${insertedData.length} sensor reading(s)`,
      count: insertedData.length,
    });
  } catch (err) {
    console.error('Webhook error:', err);

    // Handle specific error types
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
