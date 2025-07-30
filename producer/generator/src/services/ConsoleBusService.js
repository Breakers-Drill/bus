const BusService = require('./BusService');

/**
 * Реализация BusService для вывода сообщений в консоль
 */
class ConsoleBusService extends BusService {
  constructor() {
    super();
    this.isInitialized = false;
  }

  /**
   * Инициализация сервиса
   */
  async initialize() {
    console.log('🚌 ConsoleBusService initialized');
    this.isInitialized = true;
  }

  /**
   * Обработка входящего сообщения
   * @param {Object} message - Входящее сообщение
   */
  processMessage(message) {
    if (!this.isInitialized) {
      throw new Error('ConsoleBusService is not initialized');
    }

    const timestamp = new Date().toISOString();
    console.log(`\n📨 [${timestamp}] Received message:`);
    console.log(`📋 Topic: ${message.topic}`);
    console.log(`📊 Payload:`, JSON.stringify(message.payload, null, 2));
    console.log('─'.repeat(50));
  }

  /**
   * Завершение работы сервиса
   */
  async shutdown() {
    console.log('🛑 ConsoleBusService shutting down');
    this.isInitialized = false;
  }
}

module.exports = ConsoleBusService; 