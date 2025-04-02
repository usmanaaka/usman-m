export default async function handler(req, res) {
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', 'https://usman-m.com');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }
  
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Validate input
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Forward to Google Apps Script
      const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req.body,
          apiKey: process.env.API_KEY,
          referer: req.headers.origin || req.headers.referer
        })
      });
  
      // Forward the response
      const data = await response.json();
      res.status(response.status).json(data);
  
    } catch (error) {
      console.error('Submission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }