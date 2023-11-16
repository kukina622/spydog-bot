import { Interaction } from "discord.js";
import { gameService } from "../services";
import { disableButtonByCustomId } from "../utils/interaction";
import { State } from "../entities/gameState";

export async function handleButtonEvent(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (interaction.customId === "startgame_confirm") {
    const row = disableButtonByCustomId(interaction, "startgame_confirm");

    await interaction.message.edit({ components: [row] });
    await interaction.update({ content: "開始遊戲" });
    await gameService.getInstance().setGameState(State.STARTING);
    await gameService.getInstance().startGameWithRandomAssignCard();
    await gameService.getInstance().listAllUserCards();
  } else if (/^assign_id:\d+$/.test(interaction.customId)) {
    const [assignId] = /\d+/.exec(interaction.customId) as RegExpExecArray;
    const discordId = interaction.user.id;
    try {
      await gameService.getInstance().useCard(discordId, parseInt(assignId));
      const row = disableButtonByCustomId(interaction, interaction.customId);
      await interaction.message.edit({ components: [row] });
    } catch (error: any) {
      await interaction.reply(error.message);
    }
  }
}
