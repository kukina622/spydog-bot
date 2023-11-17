import { SlashCommandBuilder } from "@discordjs/builders";

const restartGame = new SlashCommandBuilder()
  .setName("restart_game")
  .setDescription("Restart the game!")
  .setDefaultMemberPermissions("0")
  .toJSON();

export default {
  guild: true,
  permission: "admin",
  command: restartGame
};
