const { Kafka } = require("kafkajs");

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "weather-data-generator",
  brokers: ["localhost:9092"],
});

async function startConsumer() {
  const consumer = kafka.consumer({ groupId: "data-processor" });
  await consumer.connect();
  await consumer.subscribe({ topic: "weather-data-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
}

// Export functions to be used by other parts of your service
module.exports = {
  startConsumer
};
