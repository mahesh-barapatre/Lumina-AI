require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const connectDB = require("../services/db");
const startScheduler = require("../services/scheduler");
const chrono = require("chrono-node");
const Reminder = require("../models/Reminder");
// const Reminder = require("../models/Reminder");

// Create bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command collection
client.commands = new Collection();

// Load commands from /commands
const commandsPath = path.join(__dirname, "../commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    logger.warn(`The command at ${file} is missing "data" or "execute".`);
  }
}

// Ready event
client.once("clientReady", async () => {
  // await connectDB(
  //   (async () => {
  //     const test = new Reminder({
  //       userId: "YOUR_DISCORD_ID",
  //       channelId: "YOUR_CHANNEL_ID",
  //       text: "Testing Mongo save",
  //       runAt: new Date(Date.now() + 60000), // 1 min from now
  //       status: "scheduled",
  //       createdAt: new Date(),
  //     });
  //     await test.save();
  //     console.log("✅ Manual reminder saved");
  //   })()
  // );
  await connectDB(); // // connect Mongo
  startScheduler(client); // start cron
  logger.info(`✅ Logged in as ${client.user.tag}`);
  require("../web/server"); // Start health server
});

// Interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`⚠️ Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Error executing command",
      ephemeral: true,
    });
  }
});

//more natural way to set reminder
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // ignore bot messages

  const content = message.content.toLowerCase();

  // trigger only if user types something like: "remind me ..."
  if (content.startsWith("remind me")) {
    // parse date/time
    const parsedDate = chrono.parseDate(content, new Date(), {
      forwardDate: true,
    });

    if (!parsedDate) {
      return message.reply("❌ Sorry, I couldn’t understand the time.");
    }

    // get reminder text (remove "remind me" and the time expression)
    const match = chrono.parse(content)[0];
    const reminderText = content
      .replace(/remind me/i, "") // remove the phrase
      .replace(match.text, "") // remove the date expression chrono recognized
      .trim();

    // Save reminder to DB
    const reminder = new Reminder({
      userId: message.author.id,
      channelId: message.channel.id,
      text: reminderText || "No text provided",
      runAt: parsedDate,
      status: "scheduled",
      createdAt: new Date(),
    });

    await reminder.save();

    return message.reply(
      `⏰ Got it! I'll remind you at **${parsedDate}**: "${
        reminderText || "No text"
      }"`
    );
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
