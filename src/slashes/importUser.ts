import { SlashCommandBuilder } from "@discordjs/builders";

const importUser = new SlashCommandBuilder()
  .setName("import_user")
  .setDescription("Auto import user from role!")
  .toJSON();

export default {
  guild: true,
  permission: "admin",
  command: importUser
};
