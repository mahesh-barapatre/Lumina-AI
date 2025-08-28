// src/scheduler.js
const cron = require("node-cron");
const Reminder = require("../models/Reminder");

function startScheduler(client) {
  cron.schedule("* * * * *", async () => {
    console.log("cron tick");
    const now = new Date();

    // Find due reminders
    const reminders = await Reminder.find({
      runAt: { $lte: now },
      status: "scheduled",
    });

    for (const reminder of reminders) {
      try {
        const user = await client.users.fetch(reminder.userId);
        await user.send(`⏰ Reminder: ${reminder.text}`);

        reminder.status = "sent";
        await reminder.save();
        console.log("Saved reminder:", reminder);
      } catch (err) {
        console.error("❌ Error sending reminder:", err);
      }
    }
  });
}

module.exports = startScheduler;
