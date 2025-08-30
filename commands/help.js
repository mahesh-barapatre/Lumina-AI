const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available commands grouped by category"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Commands Help")
      .setDescription("Here’s a quick guide to what I can do:")
      .setColor("Blurple") // Discord’s main color
      .addFields(
        {
          name: "📅 Calendar",
          value: [
            "`/events today` → Shows today’s agenda",
            "`/events tomorrow` → Shows tomorrow’s agenda",
            "`/events 2025-09-01` → Natural language/date parsing (via chrono)",
          ].join("\n"),
        },
        {
          name: "🎥 Meetings",
          value: [
            "`/meet now` → Start an instant 30-min Google Meet",
            "`/meet <time>` → Schedule a meeting at a given time",
          ].join("\n"),
        },
        {
          name: "⚙️ General",
          value: [
            "`/help` → Show this menu",
            "`/link` → Link your Google account",
          ].join("\n"),
        },
        {
          name: "⏰ Reminders",
          value: [
            "`/remind in 10 minutes take a break` → Set reminder",
            "`/remind-cancel <id>` → Cancel a reminder",
            "`/reminders` → List active reminders",
          ].join("\n"),
        }
      )
      .setFooter({
        text: "Tip: Use `/events today` every morning to see your agenda! 🚀",
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
