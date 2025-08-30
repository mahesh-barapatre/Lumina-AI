const { SlashCommandBuilder } = require("discord.js");
const { parseIntent } = require("../services/llm");
const { handleRemind } = require("./remind");
// const { handleMeet } = require("./meet");

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
        await handleRemind(interaction, intent.args.text + intent.args.time);
        break;

      // case "meet":
      //   await handleMeet(interaction, intent.args.text || input);
      //   break;

      default:
        await interaction.editReply("❌ Sorry, I couldn't understand that.");
    }
  },
};
