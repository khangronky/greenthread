import { logger, schedules } from '@trigger.dev/sdk/v3';

// Store state between runs
const lastValues: Record<string, number> = {};

export const mockIoTDataCron = schedules.task({
  id: 'mock-iot-data-cron',
  // Run every minute
  cron: '* * * * *',
  run: async (payload) => {
    logger.log('Mock IoT data cron job started', { payload });

    const WEBHOOK_URL =
      process.env.WEBHOOK_URL || 'http://localhost:3000/api/data/webhooks';
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      logger.error('WEBHOOK_SECRET not found in environment variables');
      return { success: false, error: 'Missing webhook secret' };
    }

    // Generate mock sensor data
    const sensorTypes = [
      { type: 'ph', unit: '', min: 0, max: 14, optimal: 7.0 },
      { type: 'dissolvedOxygen', unit: 'mg/L', min: 0, max: 20, optimal: 6.5 },
      { type: 'turbidity', unit: 'NTU', min: 0, max: 200, optimal: 15 },
      {
        type: 'conductivity',
        unit: 'µS/cm',
        min: 0,
        max: 10000,
        optimal: 1200,
      },
      { type: 'flowRate', unit: 'm³/h', min: 0, max: 200, optimal: 85 },
      { type: 'tds', unit: 'ppm', min: 0, max: 5000, optimal: 650 },
    ];

    // Initialize last values if empty
    if (Object.keys(lastValues).length === 0) {
      sensorTypes.forEach((sensor) => {
        lastValues[sensor.type] = sensor.optimal;
      });
    }

    const mockData = sensorTypes.map((sensor) => {
      // Trend: slowly drift towards optimal value with random walk
      const drift = (sensor.optimal - lastValues[sensor.type]) * 0.1;
      const randomWalk =
        (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.05;

      let newValue = lastValues[sensor.type] + drift + randomWalk;

      // Clamp values to min/max
      newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));

      lastValues[sensor.type] = newValue;

      return {
        type: sensor.type,
        value: parseFloat(newValue.toFixed(2)),
        unit: sensor.unit,
        recorded_at: new Date().toISOString(),
      };
    });

    logger.log('Sending mock IoT data to webhook', {
      url: WEBHOOK_URL,
      data: mockData,
    });

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': WEBHOOK_SECRET,
        },
        body: JSON.stringify(mockData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        logger.error('Webhook request failed', {
          status: response.status,
          data: responseData,
        });
        return {
          success: false,
          status: response.status,
          error: responseData,
        };
      }

      logger.log('Mock IoT data sent successfully', { response: responseData });

      return {
        success: true,
        sentData: mockData,
        response: responseData,
      };
    } catch (error) {
      logger.error('Failed to send mock IoT data', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
