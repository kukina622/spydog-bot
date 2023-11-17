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
  if (interaction.commandName === "start_game") {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setCustomId("start_game_confirm")
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
  } else if (interaction.commandName === "restart_game") {
    await gameService.getInstance().setGameState(State.STARTING);
    await interaction.reply("變更狀態成功");
  } else if (interaction.commandName === "stop_game") {
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
