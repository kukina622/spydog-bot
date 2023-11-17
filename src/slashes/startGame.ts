import { SlashCommandBuilder } from "@discordjs/builders";

const startGame = new SlashCommandBuilder()
  .setName("start_game")
  .setDescription("Start the game!")
  .setDefaultMemberPermissions("0")
  .toJSON();

export default {
  guild: true,
  permission: "admin",
  command: startGame
};
