// commands/remind-cancel.js
const { SlashCommandBuilder } = require("discord.js");
const Reminder = require("../models/Reminder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind-cancel")
    .setDescription("Cancel a reminder by ID")
    .addStringOption((opt) =>
      opt.setName("id").setDescription("Reminder ID").setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.options.getString("id");
    await interaction.deferReply();
    await module.exports.handleRemindCancel(interaction, id);
  },

  // Shared reminder handler
  async handleRemindCancel(interaction, id) {
    const reminder = await Reminder.findOne({
      _id: id,
      userId: interaction.user.id,
    });

    if (!reminder) {
      return interaction.editReply("❌ Reminder not found.");
    }

    reminder.status = "cancelled";
    await reminder.save();

    await interaction.editReply(`🗑️ Reminder "${reminder.text}" cancelled.`);
  },
};
