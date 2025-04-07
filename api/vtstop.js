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

  // Extract query parameters
  const { stopName } = req.query;

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

    const vtStopResponse = await fetch(
      `https://ext-api.vasttrafik.se/pr/v4/locations/by-text?q=${stopName}&limit=10&offset=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const stopData = await vtStopResponse.json();

    res.status(200).json({
      access_token: accessToken,
      results: stopData.results,
    });
  } catch (error) {
    console.error("Error in Västtrafik API request:", error);

    res.status(500).json({
      error: "Failed to fetch Västtrafik stop",
      details: error.message,
    });
  }
}
