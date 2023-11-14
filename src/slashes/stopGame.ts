import { SlashCommandBuilder } from "@discordjs/builders";

const stopGame = new SlashCommandBuilder()
  .setName("stopgame")
  .setDescription("Stop the game!")
  .setDefaultMemberPermissions("0")
  .toJSON();

export default {
  guild: true,
  permission: "admin",
  command: stopGame
};
