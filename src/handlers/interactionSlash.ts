import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction
} from "discord.js";
// import { gameService } from "../services/game";

export async function handleSlashEvent(interaction: Interaction) {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "startgame") {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setCustomId("startgame_confirm")
        .setLabel("確定")
        .setStyle(ButtonStyle.Success)
    ]);
    await interaction.reply({ content: "確定開始嗎？", components: [row] });
  } else if (interaction.commandName === "list") {
    await interaction.deferReply();
    const discordId: string = interaction.user.id;
    // gameService.getInstance().listNotUsedCards(discordId, interaction);
  } else if (
    interaction.commandName === "restartgame" ||
    interaction.commandName === "stopgame"
  ) {
    // gameService.getInstance().setState(interaction.commandName);
    await interaction.reply("變更狀態成功");
  }
}
