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

  const { place } = req.query;

  try {
    const API_KEY = process.env.PAPAPI_API_KEY;
    const locationName = encodeURIComponent(place);

    const locationResponse = await fetch(
      `https://api.papapi.se/lite/?query=${locationName}&format=json&apikey=${API_KEY}`
    );
    const locationData = await locationResponse.json();

    res.status(200).json({
      results: locationData.results,
    });
  } catch (error) {
    console.error("Error in PapApi API request:", error);
    res.status(500).json({
      error: "Failed to fetch location data",
      details: error.message,
    });
  }
}
