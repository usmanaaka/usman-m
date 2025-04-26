// // pages/api/booking.js

// export default async function handler(req, res) {
//     if (req.method === 'OPTIONS') {
//       res.setHeader('Access-Control-Allow-Origin', '*');
//       res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//       res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//       return res.status(200).end();
//     }

//     res.setHeader('Access-Control-Allow-Origin', '*');

//     const GOOGLE_SCRIPT_URL = process.env.BOOKING_SCRIPT_URL;

//     try {
//       if (req.method === 'GET') {
//         const action = req.query.action;
//         const url = `${GOOGLE_SCRIPT_URL}?action=${action}`;
//         const response = await fetch(url);
//         const data = await response.json();
//         return res.status(200).json(data);
//       }

//       if (req.method === 'POST') {
//         const formData = req.body;

//         // Forward the POST request to your App Script
//         const response = await fetch(GOOGLE_SCRIPT_URL, {
//           method: 'POST',
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(formData)
//         });

//         const result = await response.json();
//         return res.status(200).json(result);
//       }

//       return res.status(405).json({ error: "Method Not Allowed" });
//     } catch (error) {
//       console.error("API Error:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

import querystring from "querystring";

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const GOOGLE_SCRIPT_URL = process.env.BOOKING_SCRIPT_URL;
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

  try {
    // Handle GET requests (slot fetching)
    if (req.method === "GET") {
      const action = req.query.action;

      if (!["getSlots", "getBookings"].includes(action)) {
        return res.status(400).json({ error: "Invalid action" });
      }

      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=${action}`);
      const data = await response.json();
      return res.status(200).json(data);
    }

    // Handle POST requests (booking submissions)
    if (req.method === "POST") {
      const { "g-recaptcha-response": recaptchaResponse, ...formData } =
        req.body;

      // Verify reCAPTCHA
      const recaptchaVerify = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: querystring.stringify({
            secret: RECAPTCHA_SECRET,
            response: recaptchaResponse,
          }),
        }
      );

      const recaptchaResult = await recaptchaVerify.json();

      if (!recaptchaResult.success) {
        return res.status(400).json({
          error: "CAPTCHA verification failed",
          details: recaptchaResult,
        });
      }

      // Forward to Google Apps Script
      const scriptResponse = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          "g-recaptcha-response": recaptchaResponse,
          referer: req.headers.referer || "https://form.usman-m.com",
        }),
      });

      const result = await scriptResponse.json();
      return res.status(scriptResponse.ok ? 200 : 400).json(result);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
