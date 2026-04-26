# weather-kafka-timescale
A real-time weather data processing system that demonstrates event streaming with Apache Kafka and time-series data storage with TimescaleDB. Built with Node.js microservices for data generation, processing, storage, and analytics.

## Setting Up Kafka
1. The core Kafka broker is set up within the console and started.
   - [Kafka Quickstart](https://kafka.apache.org/quickstart )
   - `bin/kafka-server-start.sh config/server.properties`
2. A topic is then created.
3. KafkaJS is a JavaScript Kafka library used in the application.
   - [KafkaJS](https://kafka.js.org)
   - The application acts as a client to the Kafka server. The application can be a producer, consumer, or both. In this case, it is both since it produces weather data events (from the data-generator index.js file) and consumes weather data events (data-processor).
   - The client library handles all the complex communications with the Kafka server for you, so you don't need to implement the Kafka protocol yourself. It provides APIs for producing messages, consuming messages, and managing Kafka resources.

## Services Overview

The system is composed of three microservices that communicate asynchronously via Kafka topics.

```
[Data Generator] → [weather-data-events] → [Data Processor] → [processed-data] → [Storage Service] → [TimescaleDB]
```

---

### Data Generator (`services/data-generator/`)

Simulates three weather stations that emit readings every 10 seconds.

**Stations:** Yosemite (KAD94), Big Rock Ridge (KDX54), Monterey (KEC49)

**Each reading includes:**
- Temperature (°F) — hourly-dependent range (50–90°F)
- Humidity (%) — hourly-dependent range (15–95%)
- Wind Speed (mph) — station-specific range (0–20 mph)
- ISO 8601 timestamp

Publishes the full station array as a single JSON message to the `weather-data-events` Kafka topic.

---

### Data Processor (`services/data-processor/`)

Consumes raw messages from `weather-data-events`, normalizes the data, and re-publishes it.

**Transformations applied:**
- Coerces `temperature`, `humidity`, and `windSpeed` from strings to numbers
- Appends a `processedAt` timestamp

Each station is published as an individual message to the `processed-data` topic, keyed by `callSign` for consistent partition routing.

---

### Storage Service (`services/storage-service/`)

Consumes from `processed-data` and persists readings to TimescaleDB for time-series analytics.

> **Status:** Under active development — database integration (`database.js`) is not yet implemented.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Message Broker | Apache Kafka (`kafkajs` v2.2.4) |
| Database | TimescaleDB (PostgreSQL extension) |
| Serialization | JSON |

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `KAFKA_BROKERS` | `localhost:9092` | Comma-separated list of broker addresses |

## Running the System

```bash
npm start
```

This runs `start.js`, which connects the Data Generator and Data Processor concurrently before confirming startup.
