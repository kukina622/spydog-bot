import { Interaction } from "discord.js";
import { gameService } from "../services";

export async function interactionButtonEvent(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (interaction.customId === "startgame_confirm") {
    gameService.getInstance().startGame();
    interaction.reply("開始");
  }
}
