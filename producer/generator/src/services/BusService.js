/**
 * Абстрактный сервис для обработки сообщений
 */
class BusService {
  constructor() {
    if (this.constructor === BusService) {
      throw new Error('BusService is an abstract class and cannot be instantiated directly');
    }
  }

  /**
   * Обработка входящего сообщения
   * @param {Object} message - Входящее сообщение
   */
  processMessage(message) {
    throw new Error('processMessage method must be implemented by subclass');
  }

  /**
   * Инициализация сервиса
   */
  async initialize() {
    throw new Error('initialize method must be implemented by subclass');
  }

  /**
   * Завершение работы сервиса
   */
  async shutdown() {
    throw new Error('shutdown method must be implemented by subclass');
  }
}

module.exports = BusService; 