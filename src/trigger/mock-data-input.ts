import { logger, schedules } from '@trigger.dev/sdk/v3';

export const mockIoTDataCron = schedules.task({
  id: 'mock-iot-data-cron',
  // Run every minute
  cron: '* * * * *',
  run: async (payload) => {
    logger.log('Mock IoT data cron job started', { payload });

    // Get webhook secret from environment
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/data/webhooks`
      : 'http://localhost:3000/api/data/webhooks';

    if (!webhookSecret) {
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
      url: webhookUrl,
      data: mockData,
    });

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': webhookSecret,
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
