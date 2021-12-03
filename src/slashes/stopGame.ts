import { SlashCommandBuilder } from "@discordjs/builders";

const stopGame = new SlashCommandBuilder()
  .setName("stopgame")
  .setDescription("Stop the game!")
  .setDefaultPermission(false)
  .toJSON();

export default {
  global: false,
  command: stopGame
};
