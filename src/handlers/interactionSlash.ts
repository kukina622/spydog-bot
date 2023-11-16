import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction
} from "discord.js";
import { userImporterService, gameService } from "../services";
import { State } from "../entities/gameState";

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
    try {
      await interaction.deferReply();
      const discordId: string = interaction.user.id;
      await gameService.getInstance().listUserCards(discordId);
    } catch (error: any) {
      await interaction.reply(error.message);
    }
  } else if (interaction.commandName === "restartgame") {
    await gameService.getInstance().setGameState(State.STARTING);
    await interaction.reply("變更狀態成功");
  } else if (interaction.commandName === "stopgame") {
    await gameService.getInstance().setGameState(State.PAUSE);
    await interaction.reply("變更狀態成功");
  } else if (interaction.commandName === "import_user") {
    try {
      await userImporterService.getInstance().autoImportAllUser();
      await interaction.reply("匯入成功");
    } catch (error) {
      await interaction.reply("匯入失敗");
    }
  }
}
