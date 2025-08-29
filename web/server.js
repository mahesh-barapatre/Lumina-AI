const express = require("express");
const app = express();
const { oauth2Client, saveTokens } = require("../services/google"); // use ./ not ../ (since server.js is in root)
const { google } = require("googleapis");

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", bot: "Lumina" });
});

// Start OAuth flow
app.get("/oauth/google/start", (req, res) => {
  const { discordUserId } = req.query; // we pass this from Discord
  if (!discordUserId) return res.status(400).send("Missing discordUserId");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    state: discordUserId,
    prompt: "consent",
  });

  res.redirect(url);
});

// OAuth callback
app.get("/oauth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const discordUserId = req.query.state;

    const { tokens } = await oauth2Client.getToken(code);

    await saveTokens(discordUserId, tokens);

    res.send(
      "✅ Google account linked! You can close this tab and go back to Discord."
    );
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("OAuth failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/health`);
});
