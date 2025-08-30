const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Know more about Lumina"),
  async execute(interaction) {
    await interaction.reply(
      "✨ I’m Lumina, your personal Discord AI assistant!\n\n" +
        "Built by [Your Name]. Inspired by Puch AI. 💡\n" +
        "Repo: https://github.com/your-repo\n" +
        "Demo video: [coming soon]"
    );
  },
};
