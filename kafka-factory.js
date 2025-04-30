const { Kafka } = require("kafkajs");
const config = require("./config");

/**
 * Creates a Kafka client with the specified client ID
 * 
 * @param {string} clientId - The client ID for this service
 * @returns {Kafka} A configured Kafka client instance
 */
function createKafkaClient(clientId) {
  return new Kafka({
    clientId: clientId,
    brokers: config.kafka.brokers,
  });
}

/**
 * Sets up graceful shutdown handlers for Kafka clients
 * 
 * @param {object} options - Configuration options
 * @param {KafkaProducer} options.producer - Kafka producer to disconnect
 * @param {KafkaConsumer} options.consumer - Kafka consumer to disconnect
 */
function setupGracefulShutdown({ producer, consumer }) {
  const shutdown = async () => {
    console.log("Service shutting down gracefully...");
    
    if (consumer) {
      console.log("Disconnecting consumer...");
      await consumer.disconnect();
    }
    
    if (producer) {
      console.log("Disconnecting producer...");
      await producer.disconnect();
    }
    
    console.log("Shutdown complete");
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = {
  createKafkaClient,
  setupGracefulShutdown,
  topics: config.kafka.topics
};