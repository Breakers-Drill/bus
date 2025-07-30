# Bus Monitor System

Микросервисная система мониторинга с MQTT шиной данных.

## Архитектура

Система состоит из следующих компонентов:

- **MQTT Broker** (Eclipse Mosquitto) - шина сообщений
- **Generator Service** - генератор тестовых сообщений PLC

## Быстрый запуск

### 1. Запуск всей системы в Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### 2. Запуск только MQTT брокера

```bash
# Запуск только MQTT брокера
docker-compose up -d mqtt-broker

# Проверка статуса
docker-compose ps
```

### 3. Запуск Generator в Docker с MQTT

```bash
# Запуск generator с MQTT
docker-compose up -d generator

# Просмотр логов generator
docker-compose logs -f generator
```

## Конфигурация

### Переменные окружения

#### Generator Service
- `BUS_SERVICE_TYPE` - тип сервиса (`console` или `mqtt`)
- `MQTT_BROKER_URL` - URL MQTT брокера
- `MQTT_TOPIC` - топик для отправки сообщений
- `MQTT_CLIENT_ID` - ID MQTT клиента
- `PRODUCER_INTERVAL` - интервал генерации сообщений (мс)

#### MQTT Broker
- Порт: `1883` (MQTT)
- WebSocket порт: `9001` (для веб-клиентов)
- Анонимный доступ разрешен

## Тестирование

### Проверка MQTT брокера

```bash
# Подключение к MQTT брокеру для тестирования
docker exec -it bus-monitor-mqtt mosquitto_sub -t "PLC/test" -v
```

### Проверка Generator

```bash
# Просмотр логов generator
docker-compose logs -f generator
```

## Структура проекта

```
bus-monitor/
├── docker-compose.yml          # Docker Compose конфигурация
├── mqtt/
│   └── config/
│       └── mosquitto.conf     # Конфигурация MQTT брокера
├── generator/
│   ├── Dockerfile             # Docker образ для generator
│   ├── package.json           # Зависимости Node.js
│   └── src/
│       ├── index.js           # Основное приложение
│       └── services/
│           ├── BusService.js          # Абстрактный класс
│           ├── ConsoleBusService.js   # Консольная реализация
│           ├── MqttBusService.js      # MQTT реализация
│           └── GeneratorService.js    # Генератор сообщений
├── mqtt-client-monitor/
│   ├── package.json           # Зависимости MQTT клиента
│   ├── index.js               # MQTT клиент монитор
│   └── README.md              # Документация клиента
└── consumer/                  # (планируется)
```

## Разработка

### Локальный запуск Generator

```bash
cd generator
npm install
npm start
```

### Локальный запуск с MQTT

```bash
# Запуск MQTT брокера
docker-compose up -d mqtt-broker

# Запуск generator с MQTT
cd generator
BUS_SERVICE_TYPE=mqtt MQTT_BROKER_URL=mqtt://localhost:1883 npm start
```

## Мониторинг

### Статус сервисов

```bash
# Статус контейнеров
docker-compose ps

# Логи MQTT брокера
docker-compose logs mqtt-broker

# Логи Generator
docker-compose logs generator

### MQTT топики

- `PLC/test` - тестовые сообщения от Generator

## Безопасность

⚠️ **Внимание**: Текущая конфигурация разрешает анонимный доступ к MQTT брокеру. Для продакшена рекомендуется настроить аутентификацию.
