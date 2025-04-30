const dataGenerator = require("./services/data-generator");
const dataProcessor = require("./services/data-processor");

console.log("Starting Weather Kafka Application...");

async function startApplication() {
  try {
    console.log("Initializing Data Generator...");
    await dataGenerator.connect();

    console.log("Initializing Data Processor...");
    await dataProcessor.startDataProcessor();

    console.log("All services started successfully!");
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApplication();