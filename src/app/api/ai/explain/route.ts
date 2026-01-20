import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/server';
import { SENSOR_CONFIG } from '@/constants/config';
import type { SensorType } from '@/types';
import type { Database } from '@/types/supabase';

// Convert UIMessage parts to content string
function extractContent(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  if (message.content) return message.content;
  if (!message.parts) return '';
  return message.parts
    .filter((part) => part.type === 'text' && part.text)
    .map((part) => part.text)
    .join('');
}

const COMPLIANCE_THRESHOLDS = {
  ph: { min: 6.5, max: 8.5, unit: '' },
  dissolvedOxygen: { min: 5, max: 8, unit: 'mg/L' },
  turbidity: { max: 50, unit: 'NTU' },
  conductivity: { max: 2500, unit: 'µS/cm' },
  flowRate: { max: 90, unit: 'm³/h' },
  tds: { max: 1200, unit: 'ppm' },
} as const;

const systemPrompt = `You are an expert wastewater monitoring analyst for a textile manufacturing facility called GreenThread. Your role is to analyze sensor data and provide clear, actionable explanations.

## Compliance Thresholds
- pH: 6.5 - 8.5
- Dissolved Oxygen (DO): 5 - 8 mg/L
- Turbidity: ≤50 NTU
- Conductivity: ≤2500 µS/cm
- Flow Rate: ≤90 m³/h
- Total Dissolved Solids (TDS): ≤1200 ppm

## Your Tasks
1. Analyze current sensor readings against compliance thresholds
2. Compare with historical averages provided in the context
3. Identify potential causes for anomalies
4. Provide actionable recommendations

## Response Format
When discussing a specific sensor, ALWAYS emit a data annotation using this exact format on its own line:
<!--AI_DATA:{"activeSensorId":"sensorType","severity":"normal|warning|critical","actionRequired":true|false}-->

Where sensorType is one of: ph, dissolvedOxygen, turbidity, conductivity, flowRate, tds

Example:
<!--AI_DATA:{"activeSensorId":"ph","severity":"warning","actionRequired":true}-->

Severity levels:
- normal: Within compliance thresholds
- warning: Approaching threshold limits (within 10%)
- critical: Exceeding compliance thresholds

Be concise but thorough. Focus on the "why" behind anomalies and what actions should be taken.`;

async function getHistoricalAverages(supabase: SupabaseClient<Database>) {
  const sensorTypes: SensorType[] = [
    'ph',
    'dissolvedOxygen',
    'turbidity',
    'conductivity',
    'flowRate',
    'tds',
  ];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const averages: Record<string, { average: number; count: number }> = {};

  for (const type of sensorTypes) {
    const { data } = await supabase
      .from('sensor_data')
      .select('value')
      .eq('type', type)
      .gte('recorded_at', sevenDaysAgo.toISOString());

    if (data && data.length > 0) {
      const values = data
        .map((d) => d.value)
        .filter((v): v is number => v !== null);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        averages[type] = {
          average: Number(avg.toFixed(2)),
          count: values.length,
        };
      }
    }
  }

  return averages;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = await createAdminClient();

    // Fetch current sensor data for context
    const { data: currentData } = await supabase
      .from('sensor_data')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(20);

    // Group by sensor type to get latest readings
    const latestReadings: Record<
      string,
      { value: number; recorded_at: string }
    > = {};
    if (currentData) {
      for (const reading of currentData) {
        if (!latestReadings[reading.type]) {
          latestReadings[reading.type] = {
            value: reading.value,
            recorded_at: reading.recorded_at,
          };
        }
      }
    }

    // Get historical averages
    const historicalAverages = await getHistoricalAverages(supabase);

    // Build context message with current readings and historical comparison
    const sensorContext = Object.entries(latestReadings)
      .map(([type, data]) => {
        const config = SENSOR_CONFIG[type as SensorType];
        const threshold =
          COMPLIANCE_THRESHOLDS[type as keyof typeof COMPLIANCE_THRESHOLDS];
        if (!config || !threshold) return null;

        let status = 'compliant';
        if ('min' in threshold && data.value < threshold.min)
          status = 'violation';
        if ('max' in threshold && data.value > threshold.max)
          status = 'violation';

        const historical = historicalAverages[type];
        const historicalInfo = historical
          ? ` | 7-day avg: ${historical.average} ${config.unit} (${historical.count} readings)`
          : '';

        return `- ${config.name} (${type}): ${data.value} ${config.unit} [${status}]${historicalInfo}`;
      })
      .filter(Boolean)
      .join('\n');

    // Convert UIMessages to ModelMessages format
    const convertedMessages = messages.map(
      (msg: {
        role: string;
        parts?: Array<{ type: string; text?: string }>;
        content?: string;
      }) => ({
        role: msg.role as 'user' | 'assistant',
        content: extractContent(msg),
      })
    );

    const contextMessage = {
      role: 'system' as const,
      content: `Current sensor readings as of ${new Date().toISOString()}:\n${sensorContext || 'No recent data available'}\n\nWhen analyzing sensors, always include the AI_DATA annotation to trigger UI highlighting.`,
    };

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      messages: [contextMessage, ...convertedMessages],
    });

    // Convert to response and handle streaming errors
    const response = result.toTextStreamResponse();

    // Wrap the stream to catch errors during streaming
    const originalBody = response.body;
    if (!originalBody) {
      return response;
    }

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(chunk);
      },
      async flush(controller) {
        // Check if there was an error after streaming completes
        try {
          await result;
        } catch (streamError: unknown) {
          const errorMessage =
            streamError instanceof Error
              ? streamError.message
              : 'Unknown error';

          // Check for quota exceeded error
          if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            const errorText = `\n\n⚠️ **API Quota Exceeded**\n\nThe Google Gemini API rate limit has been reached. Please wait 1 minute and try again.\n\nError: ${errorMessage.slice(0, 200)}`;
            controller.enqueue(new TextEncoder().encode(errorText));
          }
        }
      },
    });

    const newBody = originalBody.pipeThrough(transformStream);

    return new Response(newBody, {
      headers: response.headers,
    });
  } catch (error: unknown) {
    console.error('AI Explain error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    // Check for quota/rate limit errors
    if (
      errorMessage.includes('quota') ||
      errorMessage.includes('429') ||
      errorMessage.includes('rate')
    ) {
      return new Response(
        `⚠️ **API Quota Exceeded**\n\nThe Google Gemini API rate limit has been reached. Please wait 1 minute and try again.\n\nDetails: ${errorMessage.slice(0, 300)}`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        }
      );
    }

    return new Response(
      `❌ **Error**\n\nFailed to process AI request.\n\nDetails: ${errorMessage.slice(0, 300)}`,
      { status: 200, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
