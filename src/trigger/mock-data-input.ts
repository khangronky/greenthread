import { logger, schedules } from '@trigger.dev/sdk/v3';

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
      { type: 'ph', unit: '', min: 5.5, max: 8.5 },
      { type: 'dissolvedOxygen', unit: 'mg/L', min: 0, max: 15 },
      { type: 'turbidity', unit: 'NTU', min: 0, max: 100 },
      { type: 'conductivity', unit: 'µS/cm', min: 0, max: 5000 },
      { type: 'flowRate', unit: 'm³/h', min: 0, max: 150 },
      { type: 'tds', unit: 'ppm', min: 0, max: 1000 },
    ];

    const mockData = sensorTypes.map((sensor) => ({
      type: sensor.type,
      value: parseFloat(
        (Math.random() * (sensor.max - sensor.min) + sensor.min).toFixed(2)
      ),
      unit: sensor.unit,
      recorded_at: new Date().toISOString(),
    }));

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
