import * as dataGenerator from "./services/data-generator/index.js";
import * as dataProcessor from "./services/data-processor/index.js";
import * as storageService from "./services/storage-service/index.js";
import * as db from "./services/storage-service/database.js";

console.log("Starting Weather Kafka Application...");

async function startApplication() {
  try {
    console.log("Initializing Data Generator...");
    await dataGenerator.connect();

    console.log("Initializing Data Processor...");
    await dataProcessor.startDataProcessor();

    console.log("Initializing Storage Service.");
    await storageService.startStorageService();
    await db.startPool();

    console.log("All services started successfully!");
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApplication();
