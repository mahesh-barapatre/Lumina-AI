const { SlashCommandBuilder } = require("discord.js");
const { google } = require("googleapis");
const { getOAuthClient } = require("../services/google");
const { checkCooldown } = require("../utils/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meetnow")
    .setDescription("Start a quick 30-min Google Meet"),

  async execute(interaction) {
    // 1️⃣ Check rate limit first
    if (!checkCooldown(interaction.user.id, "meetnow", 30000)) {
      return interaction.reply({
        content: "⚠️ Please wait 30 seconds before creating another meet",
        ephemeral: true,
      });
    }

    // 2️⃣ Defer reply because Google API may take time
    await interaction.deferReply();

    // 3️⃣ Get Google OAuth client
    const client = await getOAuthClient(interaction.user.id);
    if (!client) {
      return interaction.editReply({
        content: `⚠️ You need to link Google first: [Click here](http://localhost:3000/oauth/google/start?discordUserId=${interaction.user.id})`,
      });
    }

    // 4️⃣ Create calendar event
    const calendar = google.calendar({ version: "v3", auth: client });

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    const event = {
      summary: "Quick Meeting",
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      conferenceData: { createRequest: { requestId: `${Date.now()}` } },
    };

    const res = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = res.data.conferenceData?.entryPoints?.[0]?.uri;

    // 5️⃣ Edit deferred reply
    await interaction.editReply(
      `✅ Quick Meet started: [Join here](${meetLink})`
    );
  },
};
