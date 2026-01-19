import mqtt from 'mqtt';

// Configuration
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'default/topic';
const WEBHOOK_URL =
  process.env.WEBHOOK_URL || 'http://localhost:3000/api/data/webhooks';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Validate required environment variables
if (!WEBHOOK_SECRET) {
  console.error('❌ Error: WEBHOOK_SECRET environment variable is required');
  process.exit(1);
}

console.log('🚀 Starting MQTT Worker...');
console.log(`📡 Connecting to MQTT Broker: ${MQTT_BROKER_URL}`);
console.log(`📬 Subscribing to topic: ${MQTT_TOPIC}`);
console.log(`🔗 Webhook endpoint: ${WEBHOOK_URL}`);

// Connect to MQTT broker
const client = mqtt.connect(MQTT_BROKER_URL, {
  clientId: `mqtt-worker-${Math.random().toString(16).slice(2, 10)}`,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

// Connection event handlers
client.on('connect', () => {
  console.log('✅ Connected to MQTT Broker');

  // Subscribe to the topic
  client.subscribe(MQTT_TOPIC, { qos: 1 }, (err, granted) => {
    if (err) {
      console.error('❌ Subscription error:', err);
      return;
    }

    if (!granted || granted.length === 0) {
      console.warn('⚠️  No topics were granted for subscription');
      return;
    }

    console.log('✅ Subscribed to topics:');
    for (const grant of granted) {
      console.log(`   - ${grant.topic} (QoS ${grant.qos})`);
    }
  });
});

client.on('error', (error) => {
  console.error('❌ MQTT Connection error:', error);
});

client.on('reconnect', () => {
  console.log('🔄 Reconnecting to MQTT Broker...');
});

client.on('offline', () => {
  console.log('📴 MQTT Client offline');
});

// Message handler
client.on('message', async (topic, message) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`\n📨 [${timestamp}] Message received on topic: ${topic}`);

    // Parse the MQTT payload
    const messageStr = message.toString();
    console.log(`📦 Raw payload: ${messageStr}`);

    let payload: any;
    try {
      payload = JSON.parse(messageStr);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON payload:', parseError);
      return;
    }

    // Ensure payload is an array (webhook expects array of readings)
    const readings = Array.isArray(payload) ? payload : [payload];

    console.log(`📊 Sending ${readings.length} reading(s) to webhook...`);

    // Send to webhook endpoint
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify(readings),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Webhook responded with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('📥 Webhook response:', data);

    console.log('✅ Successfully sent data to webhook');
  } catch (error) {
    console.error('❌ Error processing message:', error);

    console.log('⚠️  Message will be skipped and not retried');
  }
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down MQTT Worker...');

  client.end(false, {}, () => {
    console.log('✅ MQTT connection closed');
    process.exit(0);
  });

  // Force exit after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.log('⚠️  Forcing exit...');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('✅ MQTT Worker is running and waiting for messages...');
console.log('   Press Ctrl+C to stop\n');
