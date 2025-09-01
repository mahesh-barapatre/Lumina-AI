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
          name: "⚙️ General",
          value: [
            "`/ai input=...` → Chat with Lumina (AI free-text)",
            "`/help` → Show this menu",
            "`/about` → Project info & credits",
          ].join("\n"),
        },
        {
          name: "⏰ Reminders",
          value: [
            "`/remind text=take a break time=10m` → Set a reminder",
            "`/remind-cancel <id>` → Cancel a reminder",
            "`/reminders` → List active reminders",
          ].join("\n"),
        },
        {
          name: "🎥 Meetings",
          value: [
            "`/meet topic=Team Sync` → Create a Meet link",
            "`/meetnow` → Start an instant Meet",
          ].join("\n"),
        },
        {
          name: "🎵 Music",
          value: [
            "`/music mood=chill` → Get Spotify tracks for a mood",
            "`/music random` → Get random daily picks",
          ].join("\n"),
        },
        {
          name: "🍽️ Hangouts",
          value: [
            "`/hangout near=Delhi type=cafe` → Find top places nearby",
          ].join("\n"),
        },
        {
          name: "📅 Events",
          value: [
            "`/events today` → Show today’s events/news",
            "`/events tomorrow` → Show tomorrow’s",
          ].join("\n"),
        }
      )
      .setFooter({
        text: "Tip: Use `/events today` every morning to see your agenda! 🚀",
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
