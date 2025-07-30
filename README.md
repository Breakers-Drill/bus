# Bus Monitor - MQTT Bridge Setup

Этот проект настраивает MQTT мост между двумя брокерами:
- **mqtt-edge** (producer) - на порту 1883
- **mqtt-cloud** (consumer) - на порту 1884

## Предварительные требования

- Docker и Docker Compose установлены
- Порты 1883 и 1884 свободны на хосте

## Переменные окружения

Основные переменные окружения:

- `MQTT_TOPIC` - топик для отправки/получения сообщений (по умолчанию: `PLC/test`)
- `MQTT_BROKER_URL` - URL MQTT брокера
- `MQTT_CLIENT_ID` - ID MQTT клиента

## Настройка

### 1. Создание общей Docker сети

```bash
docker network create bus-monitor-network
```

### 2. Запуск Producer (Edge брокер)

```bash
cd producer
docker-compose up -d
```

Producer запустит:
- MQTT брокер на порту 1883
- Generator сервис для тестирования

### 3. Запуск Consumer (Cloud брокер + Monitor)

```bash
cd consumer
docker-compose up -d
```

Consumer запустит:
- MQTT брокер на порту 1884
- MQTT Monitor для отслеживания сообщений

## Проверка работы

### Проверка сетей
```bash
docker network ls
```

### Проверка контейнеров
```bash
docker ps
```

### Проверка логов
```bash
# Producer logs
docker logs mqtt-edge

# Consumer logs  
docker logs bus-monitor-mqtt-cloud
```

### Тестирование MQTT моста

Отправьте сообщение на producer (порт 1883):
```bash
mosquitto_pub -h localhost -p 1883 -t "test/topic" -m "Hello from producer"
```

Проверьте, что сообщение дошло до consumer (порт 1884):
```bash
mosquitto_sub -h localhost -p 1884 -t "test/topic"
```

## Архитектура

```
┌─────────────────┐    ┌─────────────────┐
│   Producer      │    │   Consumer      │
│   mqtt-edge     │◄──►│   mqtt-cloud    │
│   bus-generator │    │   bus-monitor   │
│   Port: 1883    │    │   Port: 1884    │
└─────────────────┘    └─────────────────┘
```

- Producer отправляет данные на consumer через MQTT мост
- При недоступности consumer, producer кэширует сообщения
- Мост автоматически переподключается при восстановлении связи

## Остановка

```bash
# Остановить consumer
cd consumer && docker-compose down

# Остановить producer  
cd producer && docker-compose down

# Удалить сеть (опционально)
docker network rm bus-monitor-network
``` 