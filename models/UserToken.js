const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  discordUserId: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  scope: String,
  tokenType: String,
  expiryDate: Number,
});

module.exports = mongoose.model("UserToken", userTokenSchema);
