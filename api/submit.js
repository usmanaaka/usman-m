export default async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxBQudXtSh8Fe_Mo66rE9KvO55P6aQX1UzwBlmyRgj3z9wuHpHlB65LufWeG3d-zDQj/exec", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req.body,
          apiKey: process.env.API_KEY,  // From Vercel env vars
          referer: req.headers.origin   // Auto-inject origin
        })
      });
  
      res.status(200).json({ message: "Submission successful" });

    } catch (error) {
      res.status(500).json({ error: 'Submission failed' });
    }
  };