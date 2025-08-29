const { SlashCommandBuilder } = require("discord.js");
const { google } = require("googleapis");
const { getOAuthClient } = require("../services/google");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meetnow")
    .setDescription("Start a quick 30-min Google Meet"),

  async execute(interaction) {
    const client = await getOAuthClient(interaction.user.id);
    if (!client) {
      return interaction.reply(
        `⚠️ You need to link Google first: [Click here](http://localhost:3000/oauth/google/start?discordUserId=${interaction.user.id})`
      );
    }

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

    await interaction.reply(`✅ Quick Meet started: [Join here](${meetLink})`);
  },
};
