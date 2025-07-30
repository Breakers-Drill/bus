const mqtt = require('mqtt');

// Получение переменных окружения
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1884';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'PLC/test';
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID || 'mqtt-monitor';

// Подключение к MQTT брокеру
const client = mqtt.connect(MQTT_BROKER_URL, {
  clientId: MQTT_CLIENT_ID
});

console.log('🔍 MQTT Monitor starting...');
console.log(`📡 Connecting to MQTT broker: ${MQTT_BROKER_URL}`);
console.log(`📋 Topic: ${MQTT_TOPIC}`);

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');

  // Подписываемся на топик
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('❌ Failed to subscribe:', err.message);
    } else {
      console.log('📋 Subscribed to topic: PLC/test');
      console.log('👀 Waiting for messages...\n');
    }
  });
});

client.on('message', (topic, message) => {
  const timestamp = new Date().toISOString();
  console.log(`📨 [${timestamp}] Received message on topic "${topic}":`);

  try {
    const data = JSON.parse(message.toString());
    console.log(`📊 Payload:`, JSON.stringify(data.payload, null, 2));
    console.log('─'.repeat(50));
  } catch (error) {
    console.log(`📄 Raw message: ${message.toString()}`);
    console.log('─'.repeat(50));
  }
});

client.on('error', (error) => {
  console.error('❌ MQTT error:', error.message);
});

client.on('close', () => {
  console.log('🔌 MQTT connection closed');
});

// Обработка завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MQTT monitor...');
  client.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MQTT monitor...');
  client.end();
  process.exit(0);
}); 