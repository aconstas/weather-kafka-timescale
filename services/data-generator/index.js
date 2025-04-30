const { createKafkaClient, setupGracefulShutdown, topics } = require("../../kafka-factory");

const kafka = createKafkaClient("weather-data-generator");

const producer = kafka.producer();

async function connect() {
  await producer.connect();
  console.log("Data Generator: Connected to Kafka broker");
  
  setupGracefulShutdown({ producer });
  
  setInterval(sendWeatherData, 10000);
}

async function sendWeatherData() {
  const weatherData = generateData();
  try {
    await producer.send({
      topic: topics.weatherData,
      messages: [{ value: JSON.stringify(weatherData) }],
    });
    console.log("Weather data sent to Kafka");
  } catch (error) {
    console.error("Error sending weather data to Kafka:", error);
  }
}

function generateData() {
  let weatherStations = [
    { callSign: "KAD94", name: "Yosemite" },
    { callSign: "KDX54", name: "Big Rock Ridge" },
    { callSign: "KEC49", name: "Monterey" },
  ];

  for (let i = 0; i < weatherStations.length; i++) {
    weatherStations[i].temperature = getTemperature(weatherStations[i].name);
    weatherStations[i].humidity = getHumidity(weatherStations[i].name);
    weatherStations[i].windSpeed = getWindSpeed(weatherStations[i].name);
    weatherStations[i].timestamp = new Date().toISOString();
  }
  
  return weatherStations;
}

function getTemperature(station) {
  const hour = new Date().getHours();
  let min, max;

  if (station === "Yosemite") {
    if (hour >= 5 && hour <= 9) {
      min = 50;
      max = 60;
    } else if (hour >= 10 && hour <= 17) {
      min = 70;
      max = 90;
    } else {
      min = 55;
      max = 70;
    }
  } else if (station === "Big Rock Ridge") {
    if (hour >= 5 && hour <= 9) {
      min = 55;
      max = 65;
    } else if (hour >= 10 && hour <= 17) {
      min = 65;
      max = 80;
    } else {
      min = 50;
      max = 65;
    }
  } else if (station === "Monterey") {
    if (hour >= 5 && hour <= 9) {
      min = 55;
      max = 65;
    } else if (hour >= 10 && hour <= 17) {
      min = 60;
      max = 70;
    } else {
      min = 55;
      max = 65;
    }
  }

  return (Math.random() * (max - min) + min).toFixed(1);
}

function getHumidity(station) {
  const hour = new Date().getHours();
  let min, max;

  if (station === "Yosemite") {
    if (hour >= 5 && hour <= 9) {
      min = 50;
      max = 70;
    } else if (hour >= 10 && hour <= 17) {
      min = 15;
      max = 30;
    } else {
      min = 30;
      max = 50;
    }
  } else if (station === "Big Rock Ridge") {
    if (hour >= 5 && hour <= 9) {
      min = 60;
      max = 80;
    } else if (hour >= 10 && hour <= 17) {
      min = 40;
      max = 60;
    } else {
      min = 50;
      max = 70;
    }
  } else if (station === "Monterey") {
    if (hour >= 5 && hour <= 9) {
      min = 75;
      max = 90;
    } else if (hour >= 10 && hour <= 17) {
      min = 65;
      max = 80;
    } else {
      min = 80;
      max = 95;
    }
  }

  return (Math.random() * (max - min) + min).toFixed(1);
}

function getWindSpeed(station) {
  let min, max;

  if (station === "Yosemite") {
    min = 0;
    max = 10;
  } else if (station === "Big Rock Ridge") {
    min = 5;
    max = 20;
  } else if (station === "Monterey") {
    min = 5;
    max = 15;
  }

  return (Math.random() * (max - min) + min).toFixed(1);
}

// Export connect function for service initialization
module.exports = {
  connect,
};