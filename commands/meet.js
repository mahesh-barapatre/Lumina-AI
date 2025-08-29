const { SlashCommandBuilder } = require("discord.js");
const { google } = require("googleapis");
const chrono = require("chrono-node");
const { getOAuthClient } = require("../services/google");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meet")
    .setDescription("Create a Google Meet event in your calendar")
    .addStringOption((opt) =>
      opt.setName("title").setDescription("Meeting title").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("when")
        .setDescription("When (e.g. tomorrow 10am, next Monday 3pm)")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Get user inputs
      const title = interaction.options.getString("title");
      const whenInput = interaction.options.getString("when");

      // Parse natural language date/time
      const startTime = chrono.parseDate(whenInput, new Date(), {
        forwardDate: true, // ensure future date if ambiguous
      });
      if (!startTime) {
        return interaction.reply("❌ Could not understand the time you gave.");
      }

      // Default meeting = 30 mins
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      // Get OAuth client for this user
      const client = await getOAuthClient(interaction.user.id);
      if (!client) {
        return interaction.reply(
          `⚠️ You need to link Google first: [Click here](http://localhost:3000/oauth/google/start?discordUserId=${interaction.user.id})`
        );
      }

      // Initialize Google Calendar API
      const calendar = google.calendar({ version: "v3", auth: client });

      // Event object
      const event = {
        summary: title,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        conferenceData: {
          createRequest: { requestId: `${Date.now()}` }, // unique ID for Meet link
        },
      };

      // Insert into Google Calendar
      const res = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1, // needed to generate Meet link
      });

      // Extract Meet link
      const meetLink = res.data?.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video"
      )?.uri;

      if (!meetLink) {
        return interaction.reply("⚠️ Event created but Meet link not found.");
      }

      await interaction.reply(`✅ Meet created: [Join here](${meetLink})`);
    } catch (err) {
      console.error("Error creating meet:", err);
      await interaction.reply("❌ Failed to create Meet. Try again later.");
    }
  },
};
