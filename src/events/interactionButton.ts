import { Interaction } from "discord.js";

export async function interactionButtonEvent(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (interaction.customId === "startgame_confirm") {
    interaction.reply("開始");
  }
}
