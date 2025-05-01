import {
  createKafkaClient,
  setupGracefulShutdown,
  topics,
} from "../../kafka-factory.js";
import { insertData } from "./database.js";

const kafka = createKafkaClient("storage-service");

const consumer = kafka.consumer({ groupId: "storage-service" });

export async function startStorageService() {
  try {
    await consumer.connect();
    console.log("Storage-service: Storage-service connected to kafka!");

    await consumer.subscribe({
      topic: topics.processedData,
      fromBeginning: false,
    });

    setupGracefulShutdown({ consumer });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let messageData = JSON.parse(message.value);
        messageData = Object.values(messageData);
        console.log(messageData);
        insertData(messageData);
      },
    });
  } catch (error) {
    console.error("Error starting storage-service: " + error);
  }
}
