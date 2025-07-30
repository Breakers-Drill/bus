# Переменные окружения

## Обзор

Этот документ описывает все переменные окружения, используемые в проекте MQTT Bridge.

## Основные переменные

### `MQTT_BROKER_URL`
**Описание**: URL MQTT брокера для подключения клиентов

**Использование**:
- **Producer/Generator**: Подключение к Edge брокеру (mqtt-edge)
- **Consumer/Monitor**: Подключение к Cloud брокеру (mqtt-cloud)

**Значения по умолчанию**:
- Producer: `mqtt://mqtt-edge:1883` (внутри Docker сети)
- Consumer: `mqtt://mqtt-cloud:1884` (внутри Docker сети)
- Локальная разработка: `mqtt://localhost:1883` или `mqtt://localhost:1884`

**Примеры**:
```bash
# Для локальной разработки
MQTT_BROKER_URL=mqtt://localhost:1883

# Для Docker окружения
MQTT_BROKER_URL=mqtt://mqtt-edge:1883
```

### `MQTT_CLIENT_ID`
**Описание**: Уникальный идентификатор MQTT клиента

**Использование**:
- **Producer**: Идентификация генератора сообщений
- **Consumer**: Идентификация монитора сообщений

**Значения по умолчанию**:
- Producer: `bus-monitor-generator`
- Consumer: `mqtt-monitor`

**Примеры**:
```bash
MQTT_CLIENT_ID=my-custom-generator
MQTT_CLIENT_ID=production-monitor-001
```

### `MQTT_TOPIC`
**Описание**: Топик для отправки/получения сообщений

**Использование**:
- **Producer**: Топик для отправки тестовых сообщений
- **Consumer**: Топик для мониторинга сообщений

**Значение по умолчанию**: `PLC/test`

**Примеры**:
```bash
MQTT_TOPIC=sensors/temperature
MQTT_TOPIC=production/status
```

## Настройка для разработчиков

### 1. Создание .env файлов

Создайте следующие .env файлы в соответствующих папках:

#### `producer/.env`
```bash
# MQTT Configuration
MQTT_BROKER_URL=mqtt://mqtt-edge:1883
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=bus-generator

# Generator Configuration
PRODUCER_INTERVAL=500
```

#### `consumer/.env`
```bash
# MQTT Configuration
MQTT_BROKER_URL=mqtt://mqtt-cloud:1884
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=bus-monitor

# Monitor Configuration
MONITOR_LOG_LEVEL=info
```

### 2. Локальная разработка

Для локальной разработки без Docker используйте:

#### `producer/.env.local`
```bash
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=local-generator
PRODUCER_INTERVAL=1000
```

#### `consumer/.env.local`
```bash
MQTT_BROKER_URL=mqtt://localhost:1884
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=local-monitor
```

### 3. Продакшн окружение

Для продакшн окружения:

#### `producer/.env.production`
```bash
MQTT_BROKER_URL=mqtt://mqtt-edge:1883
MQTT_TOPIC=production/status
MQTT_CLIENT_ID=prod-generator-001
PRODUCER_INTERVAL=100
```

#### `consumer/.env.production`
```bash
MQTT_BROKER_URL=mqtt://mqtt-cloud:1884
MQTT_TOPIC=production/status
MQTT_CLIENT_ID=prod-monitor-001
```

## Приоритет переменных

Переменные окружения загружаются в следующем порядке (от высшего к низшему приоритету):

1. **Переменные в docker-compose.yml** (для Docker)
2. **Файл .env** (локальная разработка)
3. **Значения по умолчанию** в коде

## Проверка конфигурации

### Проверка переменных в Docker
```bash
# Producer
docker exec bus-generator env | grep MQTT

# Consumer
docker exec bus-monitor env | grep MQTT
```

### Проверка подключения
```bash
# Тест подключения к Edge брокеру
mosquitto_pub -h localhost -p 1883 -t "test" -m "hello"

# Тест подключения к Cloud брокеру
mosquitto_sub -h localhost -p 1884 -t "test"
```

## Безопасность

⚠️ **Важные замечания**:

1. **Не коммитьте .env файлы** в Git (они уже в .gitignore)
2. **Используйте уникальные CLIENT_ID** для каждого экземпляра
3. **Проверяйте права доступа** к MQTT брокерам
4. **Используйте TLS** в продакшн окружении

## Примеры использования

### Запуск с кастомными переменными
```bash
# Producer
cd producer
MQTT_TOPIC=custom/topic MQTT_CLIENT_ID=my-generator docker-compose up -d

# Consumer
cd consumer
MQTT_TOPIC=custom/topic MQTT_CLIENT_ID=my-monitor docker-compose up -d
```

### Локальная разработка
```bash
# Запуск только MQTT брокеров
cd producer && docker-compose up mqtt-edge -d
cd consumer && docker-compose up mqtt-cloud -d

# Запуск приложений локально
cd producer/generator
MQTT_BROKER_URL=mqtt://localhost:1883 npm start

cd consumer/monitor
MQTT_BROKER_URL=mqtt://localhost:1884 node index.js
``` 