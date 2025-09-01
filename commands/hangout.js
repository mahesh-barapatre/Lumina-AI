// commands/hangout.js
const { SlashCommandBuilder } = require("discord.js");
const { geocodeLocation, findPlaces } = require("../services/maps");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hangout")
    .setDescription("Find cool hangout spots")
    .addStringOption((opt) =>
      opt.setName("near").setDescription("City or area").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Type of place (cafe, restaurant, bar)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const near = interaction.options.getString("near");
    const type = interaction.options.getString("type");
    await interaction.deferReply();
    await module.exports.handleHangout(interaction, near, type);
  },

  // Shared Hangout handler
  async handleHangout(interaction, near, type) {
    try {
      const { lat, lng } = await geocodeLocation(near);
      const places = await findPlaces(lat, lng, type);

      if (!places.length) {
        return interaction.editReply(`❌ No ${type}s found near ${near}`);
      }

      const response = places
        .map(
          (p, i) =>
            `**${i + 1}. ${p.name}** (⭐ ${p.rating})\nOpen Now: ${
              p.openNow
            }\n[Map Link](${p.link})`
        )
        .join("\n\n");

      await interaction.editReply(
        `📍 Top ${type}s near **${near}**:\n\n${response}`
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed to fetch places.");
    }
  },
};
