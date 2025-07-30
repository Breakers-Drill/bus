# Переменные окружения

## Переменные

### `MQTT_BROKER_URL`
**Использование**: URL MQTT брокера для подключения клиентов
- **Producer**: подключается к Edge брокеру (mqtt-edge)
- **Consumer**: подключается к Cloud брокеру (mqtt-cloud)

### `MQTT_CLIENT_ID`
**Использование**: Уникальный идентификатор MQTT клиента
- **Producer**: идентификация генератора сообщений
- **Consumer**: идентификация монитора сообщений

### `MQTT_TOPIC`
**Использование**: Топик для отправки/получения сообщений
- **Producer**: топик для отправки тестовых сообщений
- **Consumer**: топик для мониторинга сообщений

## Настройка для разработчиков

### Docker окружение (по умолчанию)

#### `producer/.env`
```bash
MQTT_BROKER_URL=mqtt://mqtt-edge:1883
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=bus-generator
PRODUCER_INTERVAL=500
```

#### `consumer/.env`
```bash
MQTT_BROKER_URL=mqtt://mqtt-cloud:1884
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=bus-monitor
```

### Локальная разработка

#### `producer/.env.local`
```bash
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=local-generator
```

#### `consumer/.env.local`
```bash
MQTT_BROKER_URL=mqtt://localhost:1884
MQTT_TOPIC=PLC/test
MQTT_CLIENT_ID=local-monitor
```

⚠️ **Важно**: Не коммитьте .env файлы в Git (они уже в .gitignore) 