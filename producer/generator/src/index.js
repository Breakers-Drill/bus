const GeneratorService = require('./services/GeneratorService');
const ConsoleBusService = require('./services/ConsoleBusService');
const MqttBusService = require('./services/MqttBusService');

/**
 * Основное приложение Generator Service
 */
class GeneratorApp {
  constructor() {
    this.generatorService = null;
    this.busService = null;
  }

  /**
 * Инициализация приложения
 */
  async initialize() {
    console.log('🏭 Initializing Producer Application...');

    // Определение типа BusService из переменных окружения
    const busServiceType = process.env.BUS_SERVICE_TYPE || 'console';
    const intervalMs = parseInt(process.env.PRODUCER_INTERVAL) || 500;

    console.log(`🔧 Bus Service Type: ${busServiceType}`);
    console.log(`⏱️  Producer Interval: ${intervalMs}ms`);

    // Создание соответствующего BusService
    if (busServiceType === 'mqtt') {
      this.busService = new MqttBusService({
        brokerUrl: process.env.MQTT_BROKER_URL,
        topic: process.env.MQTT_TOPIC,
        clientId: process.env.MQTT_CLIENT_ID
      });
    } else {
      this.busService = new ConsoleBusService();
    }

    // Создание GeneratorService
    this.generatorService = new GeneratorService(this.busService, intervalMs);

    console.log('✅ Application initialized successfully');
  }

  /**
   * Запуск приложения
   */
  async start() {
    try {
      await this.initialize();
      await this.generatorService.start();

      console.log('\n🎯 Generator Service is running!');
      console.log('📊 Generating messages every 500ms...');
      console.log('⏹️  Press Ctrl+C to stop\n');

    } catch (error) {
      console.error('❌ Failed to start application:', error.message);
      process.exit(1);
    }
  }

  /**
   * Остановка приложения
   */
  async stop() {
    console.log('\n🛑 Shutting down Generator Application...');

    if (this.generatorService) {
      await this.generatorService.stop();
    }

    console.log('✅ Application stopped successfully');
    process.exit(0);
  }

  /**
   * Получение статуса приложения
   */
  getStatus() {
    if (!this.generatorService) {
      return { status: 'not_initialized' };
    }

    return {
      status: 'running',
      generator: this.generatorService.getStatus()
    };
  }
}

// Создание и запуск приложения
const app = new GeneratorApp();

// Обработка сигналов завершения
process.on('SIGINT', async () => {
  await app.stop();
});

process.on('SIGTERM', async () => {
  await app.stop();
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Запуск приложения
app.start().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}); 