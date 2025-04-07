import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { lat, lon } = req.query;

  console.log("ISIDE WEATHER");

  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=se&units=metric&appid=${API_KEY}`
    );
    const weatherData = await weatherResponse.json();

    console.log("weatherData", weatherData);

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=se&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    res.status(200).json({
      current: weatherData,
      forecast: forecastData,
    });
  } catch (error) {
    console.error("Error in OpenWeather API request:", error);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
}
