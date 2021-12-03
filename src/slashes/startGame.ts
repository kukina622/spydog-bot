import { SlashCommandBuilder } from "@discordjs/builders";

const startGame = new SlashCommandBuilder()
  .setName("startgame")
  .setDescription("Start the game!")
  .setDefaultPermission(false)
  .toJSON();

export default {
  global: false,
  command: startGame
};
