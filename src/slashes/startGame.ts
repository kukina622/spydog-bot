import { SlashCommandBuilder } from "@discordjs/builders";

const startGame = new SlashCommandBuilder()
  .setName("startgame")
  .setDescription("Start the game!")
  .toJSON();

export default {
  global: false,
  command: startGame
};
