const { google } = require("googleapis");
const UserToken = require("../models/UserToken");

// Create OAuth2 client with env vars
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Generate Google OAuth URL
 * @param {string} discordUserId
 */
async function getAuthUrl(discordUserId) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // required to get refresh_token
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    state: discordUserId, // link token with Discord user
    prompt: "consent", // always ask user for consent (ensures refresh_token)
  });
}

/**
 * Save tokens in DB
 * @param {string} discordUserId
 * @param {object} tokens
 */
async function saveTokens(discordUserId, tokens) {
  await UserToken.findOneAndUpdate(
    { discordUserId },
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      scope: tokens.scope,
      tokenType: tokens.token_type,
    },
    { upsert: true, new: true }
  );
}

/**
 * Load OAuth client for a user
 * @param {string} discordUserId
 * @returns {OAuth2Client|null}
 */
async function getOAuthClient(discordUserId) {
  const user = await UserToken.findOne({ discordUserId });
  if (!user) return null;

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
    scope: user.scope,
    token_type: user.tokenType,
    expiry_date: user.expiryDate,
  });

  return oauth2Client;
}

module.exports = { oauth2Client, getAuthUrl, saveTokens, getOAuthClient };
