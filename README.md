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
