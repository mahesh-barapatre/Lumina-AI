// const { SlashCommandBuilder } = require("discord.js");
// const chrono = require("chrono-node");
// const Reminder = require("../models/Reminder");

// //this input is more system style
// // /remind + time: "in Xm" text:"reminder"

// // ✅ Examples that now work:

// // /remind time:"in 10s" text:"Quick test"
// // /remind time:"in 2m" text:"Drink water"
// // /remind time:"in 1h" text:"Meeting"
// // /remind time:"tomorrow 7pm" text:"Dinner"
// // /remind time:"at 19:30" text:"Workout"

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("remind")
//     .setDescription("Set a reminder")
//     .addStringOption((option) =>
//       option
//         .setName("time")
//         .setDescription(
//           'When to remind (e.g. "in 10s", "in 10m", "in 2h", "at 19:30", "tomorrow 5pm")'
//         )
//         .setRequired(true)
//     )
//     .addStringOption((option) =>
//       option.setName("text").setDescription("Reminder text").setRequired(true)
//     ),

//   async execute(interaction) {
//     const timeInput = interaction.options.getString("time");
//     const text = interaction.options.getString("text");
//     const userId = interaction.user.id;
//     const channelId = interaction.channel.id;

//     console.log("🟡 Received remind command:", { timeInput, text });

//     let parsedDate;

//     // Handle shorthand like "in 10s / in 5m / in 2h"
//     const match = timeInput.match(/^in\s*(\d+)([smh])$/i);
//     if (match) {
//       const amount = parseInt(match[1]);
//       const unit = match[2].toLowerCase();
//       parsedDate = new Date();
//       if (unit === "s") parsedDate.setSeconds(parsedDate.getSeconds() + amount);
//       if (unit === "m") parsedDate.setMinutes(parsedDate.getMinutes() + amount);
//       if (unit === "h") parsedDate.setHours(parsedDate.getHours() + amount);
//     } else {
//       // Fallback to chrono for natural language
//       parsedDate = chrono.parseDate(timeInput, new Date(), {
//         forwardDate: true,
//       });
//     }

//     if (!parsedDate) {
//       console.warn("⚠️ Could not parse:", timeInput);
//       return interaction.reply(
//         "❌ Sorry, I couldn’t understand that time format."
//       );
//     }

//     console.log("🟢 Parsed date:", parsedDate);

//     // Save reminder
//     const reminder = new Reminder({
//       userId,
//       channelId,
//       text,
//       runAt: parsedDate,
//       status: "scheduled",
//       createdAt: new Date(),
//     });

//     await reminder.save();
//     console.log("✅ Saved reminder:", reminder);

//     await interaction.reply(
//       `⏰ Reminder set for **${parsedDate.toLocaleString()}**: "${text}"`
//     );
//   },
// };

// Natural Parsing with Chrono
// Update /remind to accept free text
// like:
// "remind me to call mom at 7pm"
// "remind me in 2 hours"

// commands/remind.js
const { SlashCommandBuilder } = require("discord.js");
const chrono = require("chrono-node");
const dayjs = require("../services/dayjs");
const Reminder = require("../models/Reminder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Set a reminder")
    .addStringOption((opt) =>
      opt
        .setName("input")
        .setDescription('E.g. "remind me to call mom at 7pm"')
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString("input");
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    // Parse with chrono
    const parsed = chrono.parse(input, new Date(), { forwardDate: true });
    if (!parsed || parsed.length === 0) {
      return interaction.reply("❌ Could not understand the time.");
    }

    const runAt = parsed[0].start.date();
    const reminderText =
      input.replace(parsed[0].text, "").trim() || "Reminder!";

    // Save
    const reminder = await Reminder.create({
      userId,
      channelId,
      text: reminderText,
      runAt,
      status: "scheduled",
      createdAt: new Date(),
    });

    await interaction.reply(
      `⏰ Reminder set for **${dayjs(runAt).format(
        "YYYY-MM-DD HH:mm"
      )}**: "${reminderText}" (ID: ${reminder._id})`
    );
  },
};
