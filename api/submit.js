import querystring from "querystring";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const { name, email, message, recaptchaResponse } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const APP_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const APP_SCRIPT_API_KEY = process.env.API_KEY;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("Missing reCAPTCHA secret key");
    return res
      .status(500)
      .json({ error: "Server config error: missing reCAPTCHA key" });
  }

  // Log the secret and response (sanitized) for debugging
  console.log(
    "Verifying reCAPTCHA with secret:",
    secretKey ? "[present]" : "[missing]"
  );
  console.log("reCAPTCHA response:", recaptchaResponse);

  const recaptchaVerifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: querystring.stringify({
        secret: secretKey,
        response: recaptchaResponse,
      }),
    }
  );

  const recaptchaVerifyData = await recaptchaVerifyRes.json();
  console.log("reCAPTCHA verify response:", recaptchaVerifyData); // ✅ Important debug log

  if (!recaptchaVerifyData.success) {
    return res.status(400).json({
      error: "reCAPTCHA verification failed",
      details: recaptchaVerifyData,
    });
  }

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
        recaptchaResponse,
      }),
    });

    const text = await response.text();
    console.log("Google Script Response:", text);

    if (response.ok) {
      return res.status(200).json({ status: "success", response: text });
    } else {
      return res
        .status(response.status)
        .json({ error: "App Script error", response: text });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
