/**
 * Сервис для генерации тестовых сообщений
 */
class GeneratorService {
  constructor(busService, intervalMs = 500) {
    this.busService = busService;
    this.intervalMs = intervalMs;
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Генерация случайного целого числа
   * @param {number} min - Минимальное значение
   * @param {number} max - Максимальное значение
   * @returns {number} Случайное целое число
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
 * Генерация случайного числа с плавающей точкой
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @returns {number} Случайное число с плавающей точкой
 */
  getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Генерация тестового сообщения
   * @returns {Object} Сгенерированное сообщение
   */
  generateMessage() {
    const msg = {
      payload: {
        "DC_out_100ms[144]": this.getRandomInt(0, 1),
        "DC_out_100ms[146]": this.getRandomInt(0, 1),
        "DC_out_100ms[148]": this.getRandomFloat(10, 50),
        "DC_out_100ms[164]": this.getRandomFloat(20, 80),
        "DC_out_100ms[165]": this.getRandomFloat(5, 25),
        "DC_out_100ms[140].8": this.getRandomInt(0, 100),
        "DC_out_100ms[140].10": this.getRandomFloat(0, 5),
        "DC_out_100ms[140].9": this.getRandomFloat(50, 150),
        "DC_out_100ms[141].10": this.getRandomFloat(100, 200),
        "DC_out_100ms[141].8": this.getRandomInt(0, 1),
        "DC_out_100ms[141].9": this.getRandomFloat(15, 75),
        "DC_out_100ms[140].13": this.getRandomFloat(0, 10),
        "DC_out_100ms[140].14": this.getRandomInt(0, 500),
        "DC_out_100ms[141].13": this.getRandomFloat(5, 50)
      },
      topic: "PLC/test"
    };

    return msg;
  }

  /**
   * Отправка сообщения через BusService
   * @param {Object} message - Сообщение для отправки
   */
  async sendMessage(message) {
    try {
      await this.busService.processMessage(message);
    } catch (error) {
      console.error('❌ Error processing message:', error.message);
    }
  }

  /**
 * Запуск генерации сообщений
 */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ GeneratorService is already running');
      return;
    }

    console.log(`🚀 Starting GeneratorService (interval: ${this.intervalMs}ms)`);
    this.isRunning = true;

    // Инициализация BusService
    await this.busService.initialize();

    // Запуск генерации сообщений
    this.intervalId = setInterval(async () => {
      const message = this.generateMessage();
      await this.sendMessage(message);
    }, this.intervalMs);
  }

  /**
 * Остановка генерации сообщений
 */
  async stop() {
    if (!this.isRunning) {
      console.log('⚠️ GeneratorService is not running');
      return;
    }

    console.log('🛑 Stopping GeneratorService');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Завершение работы BusService
    await this.busService.shutdown();
  }

  /**
   * Получение статуса сервиса
   * @returns {Object} Статус сервиса
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      busServiceType: this.busService.constructor.name
    };
  }
}

module.exports = GeneratorService; 