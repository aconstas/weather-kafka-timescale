const { Kafka } = require("kafkajs");

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "weather-data-generator",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

async function startDataProcessor() {
  const consumer = kafka.consumer({ groupId: "data-processor" });
  await consumer.connect();
  await consumer.subscribe({
    topic: "weather-data-events",
    fromBeginning: true,
  });

  // Connect when your service starts
  await producer.connect();
  console.log("Connected to Kafka broker");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const processedData = await processData(JSON.parse(message.value));
      await sendProcessedData(processedData);
    },
  });
}

// Iterate through data and send 1 message per weather station object
async function sendProcessedData(processedData) {
  try {
    const promises = processedData.map((station) => {
      return producer.send({
        topic: "processed-data",
        key: station.callSign,
        messages: [{ value: JSON.stringify(station) }],
      });
    });

    await Promise.all(promises);
    console.log("All processed data sent to Kafka");
  } catch (error) {
    console.error("Error sending processed data to Kafka:", error);
  }
}

function processData(data) {
  data.forEach((element) => {
    element.temperature = Number(element.temperature);
    element.humidity = Number(element.humidity);
    element.windSpeed = Number(element.windSpeed);
  });
  return data;
  //   console.log(data);
}

module.exports = {
  startDataProcessor,
};
