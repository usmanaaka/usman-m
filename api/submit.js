import querystring from 'querystring';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, email, message, recaptchaResponse } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const APP_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const APP_SCRIPT_API_KEY = process.env.API_KEY;

  const body = querystring.stringify({
    name,
    email,
    message,
    apiKey: APP_SCRIPT_API_KEY,
    referer: "https://form.usman-m.com",
    recaptchaResponse
  });

  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        apiKey: APP_SCRIPT_API_KEY,
        referer: "https://form.usman-m.com",
        recaptchaResponse
      })
    });

    const text = await response.text();  // Get raw response text for debugging
    console.log('Google Script Response:', text);  // Log the response

    if (response.ok) {
      return res.status(200).json({ status: "success", response: text });
    } else {
      return res.status(response.status).json({ error: "App Script error", response: text });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}








// export default async function handler(req, res) {
//   // Enable CORS
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Handle OPTIONS preflight
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   // Test endpoint
//   if (req.method === 'POST') {
//     return res.status(200).json({ 
//       success: true,
//       message: "API is working!",
//       body: req.body 
//     });
//   }

//   // Block non-POST requests
//   return res.status(405).json({ error: 'Method not allowed' });
// }


// export default async function handler(req, res) {
//     // Handle OPTIONS preflight request
//     if (req.method === 'OPTIONS') {
//       res.setHeader('Access-Control-Allow-Origin', '*');
//       res.setHeader('Access-Control-Allow-Methods', 'POST');
//       res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//       return res.status(200).end();
//     }
  
//     // Only allow POST requests
//     if (req.method !== 'POST') {
//       return res.status(405).json({ error: 'Method not allowed' });
//     }
  
//     try {
//       // Validate input
//       const { name, email, message } = req.body;
//       if (!name || !email || !message) {
//         return res.status(400).json({ error: 'Missing required fields' });
//       }
  
//       // Forward to Google Apps Script
//       const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...req.body,
//           apiKey: process.env.API_KEY,
//           referer: req.headers.origin || req.headers.referer
//         })
//       });
  
//       // Forward the response
//       const data = await response.json();
//       res.status(response.status).json(data);
  
//     } catch (error) {
//       console.error('Submission error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }