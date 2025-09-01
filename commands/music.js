// commands/music.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getTracksForMood } = require("../services/spotify");
const { moodToQuery } = require("../utils/moods");
const { dailySeed, pickN } = require("../utils/random");

const RANDOM_QUERIES = [
  "today's top hits",
  "lofi beats",
  "indie chill",
  "deep house",
  "retro wave",
  "latin pop",
  "bollywood hits",
  "k-pop hits",
  "jazz vibes",
  "acoustic chill",
  "hip hop 2025",
  "focus beats",
  "r&b slow",
  "mellow mood",
  "feel good",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Get Spotify music suggestions")
    .addSubcommand((sub) =>
      sub
        .setName("mood")
        .setDescription("Suggest tracks for a mood")
        .addStringOption((opt) =>
          opt
            .setName("mood")
            .setDescription("e.g., chill, focus, happy, workout")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("random").setDescription("Daily random picks")
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    await interaction.deferReply();
    if (sub === "mood") {
      const mood = interaction.options.getString("mood");
      await module.exports.handleMusic(interaction, mood);
    }
    if (sub === "random") {
      await module.exports.handleRandomMusic(interaction);
    }
    return interaction.editReply("❌ Unknown subcommand.");
  },

  // Shared Music handler
  async handleMusic(interaction, mood) {
    try {
      const query = moodToQuery(mood);

      const tracks = await getTracksForMood(query, 3);
      if (!tracks.length) {
        return interaction.editReply(
          `❌ Couldn't find tracks for **${mood}**.`
        );
      }

      const embeds = tracks.map((t) =>
        new EmbedBuilder()
          .setTitle(`${t.name}`)
          .setURL(t.url)
          .setDescription(`by **${t.artists}**`)
          .setThumbnail(t.albumImage || null)
          .setColor(0x1db954)
          .addFields(
            ...(t.previewUrl ? [{ name: "Preview", value: t.previewUrl }] : [])
          )
      );

      return interaction.editReply({
        content: `🎧 Mood: **${mood}** → ${tracks
          .map((t) => `[${t.name}](${t.url})`)
          .join(" • ")}`,
        embeds,
      });
    } catch (err) {
      console.error("Error in /music:", err?.response?.data || err);
      return interaction.editReply(
        "❌ Failed to fetch music. Please try again."
      );
    }
  },

  async handleRandomMusic(interaction) {
    try {
      const seed = dailySeed(interaction.user.id);
      const [q] = pickN(RANDOM_QUERIES, 1, seed);
      const tracks = await getTracksForMood(q, 3);

      if (!tracks.length) {
        return interaction.editReply(
          "❌ Couldn't find random picks today. Try again later."
        );
      }

      const embeds = tracks.map((t) =>
        new EmbedBuilder()
          .setTitle(`${t.name}`)
          .setURL(t.url)
          .setDescription(`by **${t.artists}**`)
          .setThumbnail(t.albumImage || null)
          .setColor(0x1db954)
      );

      return interaction.editReply({
        content: `🎲 Daily random based on **${q}** → ${tracks
          .map((t) => `[${t.name}](${t.url})`)
          .join(" • ")}`,
        embeds,
      });
    } catch (error) {
      console.error("Error in /music random:", err?.response?.data || err);
      return interaction.editReply(
        "❌ Failed to fetch music. Please try again."
      );
    }
  },
};
