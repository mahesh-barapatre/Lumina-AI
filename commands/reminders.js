// commands/reminders.js
const { SlashCommandBuilder } = require("discord.js");
const dayjs = require("../services/dayjs");
const Reminder = require("../models/Reminder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reminders")
    .setDescription("List your upcoming reminders"),

  async execute(interaction) {
    await interaction.deferReply();
    await module.exports.handleReminders(interaction, input);
  },

  //shared Handler
  async handleReminders(interaction) {
    const reminders = await Reminder.find({
      userId: interaction.user.id,
      status: "scheduled",
      runAt: { $gte: new Date() },
    })
      .sort("runAt")
      .limit(10);

    if (reminders.length === 0) {
      return interaction.editReply("✅ You have no upcoming reminders.");
    }

    const list = reminders
      .map(
        (r) =>
          `• [${r._id}] ${r.text} — ${dayjs(r.runAt).format(
            "YYYY-MM-DD HH:mm"
          )}`
      )
      .join("\n");

    await interaction.editReply(`📋 Your reminders:\n${list}`);
  },
};
