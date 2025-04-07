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

// // api/vasttrafik.js
// import fetch from "node-fetch";

// export default async function handler(req, res) {
//   // Enable CORS
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );

//   // Handle preflight OPTIONS request
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//     return;
//   }

//   // Extract query parameters
//   const { stationId } = req.query;

//   if (!stationId) {
//     return res.status(400).json({ error: "Station ID is required" });
//   }

//   try {
//     // Get token using credentials from environment variables
//     // const credentials = process.env.VASTTRAFIK_CREDENTIALS;

//     const credentials =
//       "***REMOVED***";

//     const tokenResponse = await fetch("https://ext-api.vasttrafik.se/token", {
//       body: "grant_type=client_credentials&scope=0",
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     });

//     if (!tokenResponse.ok) {
//       throw new Error(
//         `Token request failed with status ${tokenResponse.status}`
//       );
//     }

//     const tokenData = await tokenResponse.json();

//     // Get departures data
//     const departuresResponse = await fetch(
//       `https://ext-api.vasttrafik.se/pr/v4/stop-areas/${stationId}/departures`,
//       {
//         headers: {
//           Authorization: `Bearer ${tokenData.access_token}`,
//         },
//       }
//     );

//     if (!departuresResponse.ok) {
//       throw new Error(
//         `Departures request failed with status ${departuresResponse.status}`
//       );
//     }

//     const departuresData = await departuresResponse.json();

//     // Return the data to the client
//     return res.status(200).json(departuresData);
//   } catch (error) {
//     console.error("Error:", error);
//     return res
//       .status(500)
//       .json({ error: error.message || "Failed to fetch data" });
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const fetch = require("node-fetch");

// module.exports = async (req, res) => {
//   console.log("API called with query:", req.query);
//   // Enable CORS
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );

//   // Handle preflight OPTIONS request
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//     return;
//   }

//   // Extract query parameters
//   const { stationId } = req.query;

//   if (!stationId) {
//     return res.status(400).json({ error: "Station ID is required" });
//   }

//   try {
//     // Get token using credentials from environment variables
//     const credentials = process.env.VASTTRAFIK_CREDENTIALS;

//     const tokenResponse = await fetch("https://ext-api.vasttrafik.se/token", {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: "grant_type=client_credentials&scope=0",
//     });

//     if (!tokenResponse.ok) {
//       throw new Error(
//         `Token request failed with status ${tokenResponse.status}`
//       );
//     }

//     const tokenData = await tokenResponse.json();

//     // Get departures data
//     const departuresResponse = await fetch(
//       `https://ext-api.vasttrafik.se/pr/v4/stop-areas/${stationId}/departures`,
//       {
//         headers: {
//           Authorization: `Bearer ${tokenData.access_token}`,
//         },
//       }
//     );

//     if (!departuresResponse.ok) {
//       throw new Error(
//         `Departures request failed with status ${departuresResponse.status}`
//       );
//     }

//     const departuresData = await departuresResponse.json();

//     // Return the data to the client
//     return res.status(200).json(departuresData);
//   } catch (error) {
//     console.error("Error:", error);
//     return res
//       .status(500)
//       .json({ error: error.message || "Failed to fetch data" });
//   }
// };
