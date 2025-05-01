import {
  createKafkaClient,
  setupGracefulShutdown,
  topics,
} from "../../kafka-factory.js";

const kafka = createKafkaClient("weather-data-processor");

// Create a producer for sending processed data
const producer = kafka.producer();

/**
 * Start the data processor service.
 * Connects consumer and producer, sets up message handling.
 */
export async function startDataProcessor() {
  const consumer = kafka.consumer({ groupId: "data-processor" });

  try {
    await consumer.connect();
    console.log("Data Processor: Consumer connected to Kafka broker");

    await consumer.subscribe({
      topic: topics.weatherData,
      fromBeginning: true,
    });

    await producer.connect();
    console.log("Data Processor: Producer connected to Kafka broker");

    setupGracefulShutdown({ consumer, producer });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // console.log(`Processing message from partition ${partition}`);

        try {
          const messageData = JSON.parse(message.value);
          const processedData = await processData(messageData);

          await sendProcessedData(processedData);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });

    console.log("Data Processor: Started successfully");
  } catch (error) {
    console.error("Error starting data processor:", error);
    if (consumer) await consumer.disconnect().catch(() => {});
    if (producer) await producer.disconnect().catch(() => {});
  }
}

/**
 * Process incoming weather data.
 * Converts string values to numbers and adds processing metadata.
 */
async function processData(data) {
  return data.map((element) => ({
    ...element,
    temperature: Number(element.temperature),
    humidity: Number(element.humidity),
    windSpeed: Number(element.windSpeed),
    //processedAt: new Date().toISOString(),
  }));
}

/**
 * Send processed data to output topic.
 * Each station is sent as a separate message with its callSign as the key.
 */
async function sendProcessedData(processedData) {
  try {
    const promises = processedData.map((station) => {
      return producer.send({
        topic: topics.processedData,
        key: station.callSign,
        messages: [{ value: JSON.stringify(station) }],
      });
    });

    await Promise.all(promises);
    console.log(
      `Processed data for ${processedData.length} stations sent to Kafka`
    );
  } catch (error) {
    console.error("Error sending processed data to Kafka:", error);
  }
}