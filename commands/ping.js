const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if Lumina is alive"),
  async execute(interaction) {
    await interaction.reply("Lumina is alive ⚡");
  },
};
