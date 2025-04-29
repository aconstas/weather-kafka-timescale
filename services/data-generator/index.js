const { Kafka } = require("kafkajs");

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "weather-data-generator",
  brokers: ["localhost:9092"],
});

// Create a producer instance
const producer = kafka.producer();

// Connect when your service starts
async function connect() {
  await producer.connect();
  console.log("Connected to Kafka broker");
  setInterval(sendWeatherData, 10000);
}

// Function to send weather data
async function sendWeatherData() {
  const weatherData = generateData();
  try {
    await producer.send({
      topic: "weather-data-events",
      messages: [{ value: JSON.stringify(weatherData) }],
    });
    console.log("Weather data sent to Kafka");
  } catch (error) {
    console.error("Error sending weather data to Kafka:", error);
  }
}

// Export functions to be used by other parts of your service
module.exports = {
  connect,
  //sendWeatherData,
};

process.on('SIGINT', async () => {
    await producer.disconnect();
    process.exit(0);
  });

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
  //console.log(weatherStations)
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

// console.log(generateData());
