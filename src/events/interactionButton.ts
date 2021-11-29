import { Interaction } from "discord.js";
import { gameService } from "../services";

export async function interactionButtonEvent(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (interaction.customId === "startgame_confirm") {
    gameService.getInstance().startGame();
    interaction.reply("開始");
  } else if (/^assign_id:\d+$/.test(interaction.customId)) {
    const [assignId] = /\d+/.exec(interaction.customId) as RegExpExecArray;
    const discordId = interaction.user.id;
    gameService
      .getInstance()
      .userUseCard(parseInt(assignId), discordId, interaction);
  }
}
