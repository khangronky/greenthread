import { z } from 'zod';

// Schema for a single sensor reading
export const sensorReadingSchema = z.object({
  type: z.string().min(1, 'Sensor type is required'),
  value: z.number('Value must be a finite number'),
  unit: z.string().min(0, 'Unit is required'),
  recorded_at: z.iso.datetime('Invalid datetime format'),
});

// Schema for webhook payload - supports both single reading and batch
export const webhookPayloadSchema = z
  .array(sensorReadingSchema)
  .min(1, 'At least one sensor reading is required');
