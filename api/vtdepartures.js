import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { stationId = "9021014004940000" } = req.query;

  try {
    const credentials = process.env.VASTTRAFIK_CREDENTIALS;

    const tokenResponse = await fetch("https://ext-api.vasttrafik.se/token", {
      body: "grant_type=client_credentials&scope=0",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const departuresResponse = await fetch(
      `https://ext-api.vasttrafik.se/pr/v4/stop-areas/${stationId}/departures`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const departuresData = await departuresResponse.json();

    res.status(200).json({
      access_token: accessToken,
      results: departuresData.results,
    });
  } catch (error) {
    console.error("Error in Västtrafik API request:", error);

    res.status(500).json({
      error: "Failed to fetch departures",
      details: error.message,
    });
  }
}
