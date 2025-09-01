const { SlashCommandBuilder } = require("discord.js");
const { parseIntent } = require("../services/llm");

//import the Handlers
const { handleRemind } = require("./remind");
const { handleReminders } = require("./reminders");
const { handleRemindCancel } = require("./remind-cancel");
const { handleMeet } = require("./meet");
const { handleMeetNow } = require("./meetnow");
const { handleEvents } = require("./events");
const { handleMusic, handleRandomMusic } = require("./music");
const { handleHangout } = require("./hangout");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Talk to Lumina in natural language")
    .addStringOption((opt) =>
      opt.setName("input").setDescription("Say something").setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString("input");
    // console.log(input, "this is the input");
    await interaction.deferReply();
    const intent = await parseIntent(input);

    switch (intent.action) {
      case "remind":
        await handleRemind(
          interaction,
          intent.args.text + " " + intent.args.time
        );
        break;

      case "reminders":
        await handleReminders(interaction);
        break;

      case "remind-cancel":
        await handleRemindCancel(interaction, intent.args.id);
        break;

      case "meet":
        await handleMeet(interaction, intent.args.when, intent.args.title);
        break;

      case "meetnow":
        await handleMeetNow(interaction);
        break;

      case "events":
        await handleEvents(interaction, intent.args.when);
        break;

      case "music":
        await handleMusic(interaction, intent.args.mood);
        break;

      case "random-music":
        await handleRandomMusic(interaction);
        break;

      case "hangout":
        await handleHangout(interaction, intent.args.location);
        break;

      case "about":
        await interaction.editReply(
          "✨ I’m **Lumina**, your AI-powered Discord assistant. I can set reminders, create meetings, suggest music, recommend hangouts, fetch events, and more!"
        );
        break;

      case "help":
        await interaction.editReply(
          "📜 **Available Commands:**\n" +
            "`/remind <time> <msg>` → Set a reminder\n" +
            "`/reminders` → Show active reminders\n" +
            "`/remind-cancel <id>` → Cancel a reminder\n" +
            "`/meet` → Schedule a Google Meet\n" +
            "`/meetnow` → Instant Google Meet link\n" +
            "`/events` → Show Google Calendar events\n" +
            "`/music <mood>` → Suggest music from Spotify\n" +
            "`/hangout <location>` → Recommend restaurants & spots\n" +
            "`/whois <number>` → Lookup caller info\n" +
            "`/about` → Learn about me\n" +
            "`/help` → Show this help menu"
        );
        break;

      default:
        await interaction.editReply("❌ Sorry, I couldn't understand that.");
    }
  },
};
