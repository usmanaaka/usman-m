// pages/api/booking.js

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }
  
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    const GOOGLE_SCRIPT_URL = process.env.BOOKING_SCRIPT_URL;
  
    try {
      if (req.method === 'GET') {
        const action = req.query.action;
        const url = `${GOOGLE_SCRIPT_URL}?action=${action}`;
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
      }
  
      if (req.method === 'POST') {
        const formData = req.body;
  
        // Forward the POST request to your App Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
  
        const result = await response.json();
        return res.status(200).json(result);
      }
  
      return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  