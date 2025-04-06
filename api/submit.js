export default async function handler(req, res) {
  // CORS preflight handling
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // CORS header for actual POST request
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, email, message, recaptchaResponse } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyHP35Nxs9ofbw76MCqZlW8uKGbOQQNOIz4yaDXiAhznfHupzjWeyn0UAyAbB9ksjbh/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        apiKey: "Memon_123!Pak$%_(&!@F442)@",
        referer: "https://form.usman-m.com",
        recaptchaResponse
      })
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ status: "success", result });
    } else {
      return res.status(response.status).json(result);
    }
  } catch (error) {
    console.error("Error forwarding to App Script:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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