// models/Reminder.js
const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  text: { type: String, required: true },
  runAt: { type: Date, required: true },
  status: { type: String, enum: ["scheduled", "sent"], default: "scheduled" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reminder", reminderSchema);
