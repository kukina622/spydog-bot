import { SlashCommandBuilder } from "@discordjs/builders";

const listCard = new SlashCommandBuilder()
  .setName("list")
  .setDescription("Show your cards!")
  .toJSON();

export default {
  guild: false,
  permission: "everyone",
  command: listCard
};
