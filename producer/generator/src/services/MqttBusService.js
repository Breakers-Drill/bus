const BusService = require('./BusService');
const mqtt = require('mqtt');

/**
 * Реализация BusService для отправки сообщений в MQTT брокер
 */
class MqttBusService extends BusService {
  constructor(options = {}) {
    super();
    this.brokerUrl = options.brokerUrl || process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    this.topic = options.topic || process.env.MQTT_TOPIC || 'PLC/test';
    this.clientId = options.clientId || `producer-${Math.random().toString(16).slice(3)}`;
    this.client = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectInterval = 5000; // 5 секунд
  }

  /**
   * Инициализация MQTT клиента
   */
  async initialize() {
    console.log(`🚌 MqttBusService initializing...`);
    console.log(`📡 Broker URL: ${this.brokerUrl}`);
    console.log(`📋 Topic: ${this.topic}`);
    console.log(`🆔 Client ID: ${this.clientId}`);

    return new Promise((resolve, reject) => {
      try {
        // Создание MQTT клиента
        this.client = mqtt.connect(this.brokerUrl, {
          clientId: this.clientId,
          clean: true,
          reconnectPeriod: this.reconnectInterval,
          connectTimeout: 30000,
          keepalive: 60
        });

        // Обработка подключения
        this.client.on('connect', () => {
          console.log(`✅ Connected to MQTT broker: ${this.brokerUrl}`);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        // Обработка ошибок подключения
        this.client.on('error', (error) => {
          console.error(`❌ MQTT connection error:`, error.message);
          this.isConnected = false;
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          } else {
            console.error(`❌ Max reconnection attempts reached`);
            reject(error);
          }
        });

        // Обработка отключения
        this.client.on('close', () => {
          console.log(`🔌 MQTT connection closed`);
          this.isConnected = false;
        });

        // Обработка переподключения
        this.client.on('reconnect', () => {
          console.log(`🔄 Reconnecting to MQTT broker...`);
        });

        // Обработка сообщений (для отладки)
        this.client.on('message', (topic, message) => {
          console.log(`📨 Received message on topic ${topic}: ${message.toString()}`);
        });

      } catch (error) {
        console.error(`❌ Failed to initialize MQTT client:`, error.message);
        reject(error);
      }
    });
  }

  /**
   * Отправка сообщения в MQTT брокер
   * @param {Object} message - Сообщение для отправки
   */
  async processMessage(message) {
    if (!this.isConnected || !this.client) {
      throw new Error('MQTT client is not connected');
    }

    return new Promise((resolve, reject) => {
      try {
        // Преобразование сообщения в JSON строку
        const payload = JSON.stringify(message);

        // Отправка сообщения
        this.client.publish(this.topic, payload, { qos: 1 }, (error) => {
          if (error) {
            console.error(`❌ Failed to publish message:`, error.message);
            reject(error);
          } else {
            const timestamp = new Date().toISOString();
            console.log(`📤 [${timestamp}] Message published to topic "${this.topic}":`);
            console.log(`📊 Payload:`, JSON.stringify(message.payload, null, 2));
            console.log('─'.repeat(50));
            resolve();
          }
        });

      } catch (error) {
        console.error(`❌ Error processing message:`, error.message);
        reject(error);
      }
    });
  }

  /**
   * Завершение работы MQTT клиента
   */
  async shutdown() {
    console.log(`🛑 Shutting down MqttBusService...`);

    return new Promise((resolve) => {
      if (this.client) {
        this.client.end(true, () => {
          console.log(`✅ MQTT client disconnected`);
          this.isConnected = false;
          this.client = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Получение статуса подключения
   * @returns {Object} Статус MQTT клиента
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      brokerUrl: this.brokerUrl,
      topic: this.topic,
      clientId: this.clientId,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

module.exports = MqttBusService; 