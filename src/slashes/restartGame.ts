import { SlashCommandBuilder } from "@discordjs/builders";

const restartGame = new SlashCommandBuilder()
  .setName("restartgame")
  .setDescription("Restart the game!")
  .toJSON();

export default {
  global: false,
  command: restartGame
};
