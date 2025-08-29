const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { google } = require("googleapis");
const { getOAuthClient } = require("../services/google");
const chrono = require("chrono-node");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("Show your Google Calendar events")
    .addStringOption((opt) =>
      opt
        .setName("when")
        .setDescription(
          "Which day? (today, tomorrow, or natural language e.g. 'next monday')"
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const whenInput = interaction.options.getString("when");
      const now = new Date();
      let targetDate;

      // --- Strict validation first
      if (whenInput.toLowerCase() === "today") {
        targetDate = now;
      } else if (whenInput.toLowerCase() === "tomorrow") {
        targetDate = new Date(now);
        targetDate.setDate(now.getDate() + 1);
      } else {
        // --- Natural language fallback with chrono
        const parsed = chrono.parseDate(whenInput, now, { forwardDate: true });
        if (parsed) {
          targetDate = parsed;
        } else {
          return interaction.editReply(
            `⚠️ I couldn't understand **${whenInput}**. Try "today", "tomorrow", or natural language like "next monday", "15 sep", etc.`
          );
        }
      }

      // Calculate day boundaries
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      );
      const endOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23,
        59,
        59
      );

      // Auth
      const client = await getOAuthClient(interaction.user.id);
      if (!client) {
        return interaction.editReply(
          `⚠️ You need to link Google first: [Click here](http://localhost:3000/oauth/google/start?discordUserId=${interaction.user.id})`
        );
      }

      const calendar = google.calendar({ version: "v3", auth: client });

      const eventsRes = await calendar.events.list({
        calendarId: "primary",
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = eventsRes.data.items;

      if (!events.length) {
        return interaction.editReply(`✅ No events scheduled for ${whenInput}`);
      }

      // Group events by time-of-day
      const groups = { morning: [], afternoon: [], evening: [], night: [] };

      events.forEach((ev) => {
        if (!ev.start?.dateTime) return; // skip all-day
        const startDate = new Date(ev.start.dateTime);
        const hour = startDate.getHours();

        if (hour >= 5 && hour < 12) groups.morning.push(ev);
        else if (hour >= 12 && hour < 17) groups.afternoon.push(ev);
        else if (hour >= 17 && hour < 22) groups.evening.push(ev);
        else groups.night.push(ev);
      });

      const embed = new EmbedBuilder()
        .setTitle(`📅 Events for ${whenInput}`)
        .setColor("Blue");

      const addGroup = (label, emoji, arr) => {
        if (!arr.length) return;
        embed.addFields({
          name: `${emoji} ${label}`,
          value: arr
            .map((ev) => {
              const start = ev.start.dateTime
                ? new Date(ev.start.dateTime).toLocaleTimeString("en-IN", {
                    timeStyle: "short",
                  })
                : "All-day";
              const end = ev.end.dateTime
                ? new Date(ev.end.dateTime).toLocaleTimeString("en-IN", {
                    timeStyle: "short",
                  })
                : "";
              return `**${ev.summary || "(No title)"}** \n ${start} ${end}\n${
                ev.hangoutLink ? `[Meet Link](${ev.hangoutLink})` : ""
              }\n`;
            })
            .join("\n"),
        });
      };

      addGroup("Morning", "🕘", groups.morning);
      addGroup("Afternoon", "🌆", groups.afternoon);
      addGroup("Evening", "🌙", groups.evening);
      addGroup("Night", "🌃", groups.night);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Error in /events:", err);
      await interaction.editReply("❌ Failed to fetch events.");
    }
  },
};
