const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands"),
  async execute(interaction) {
    await interaction.reply("📜 Commands:\n- `/ping`\n- `/help`");
  },
};
