export const config = {
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
    topics: {
      weatherData: "weather-data-events",
      processedData: "processed-data",
    },
  },
};
