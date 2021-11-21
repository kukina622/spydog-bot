import { Interaction, MessageActionRow, MessageButton } from "discord.js";

export async function interactionSlashEvent(interaction: Interaction) {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "startgame") {
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("startgame_confirm")
        .setLabel("確定")
        .setStyle("SUCCESS")
    ]);
    await interaction.reply({ content: "確定開始嗎？", components: [row] });
  }
}
