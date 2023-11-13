import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  APIButtonComponent
} from "discord.js";

export async function handleButtonEvent(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (interaction.customId === "startgame_confirm") {
    // gameService.getInstance().startGame();

    let row = interaction.message.components[0];
    (row.components as any) = row.components.map((button) =>
      button.customId === "startgame_confirm"
        ? ButtonBuilder.from(button as APIButtonComponent).setDisabled(true)
        : button
    );

    await interaction.message.edit({ components: [row] });
    await interaction.update({ content: "開始遊戲" });
  } else if (/^assign_id:\d+$/.test(interaction.customId)) {
    const [assignId] = /\d+/.exec(interaction.customId) as RegExpExecArray;
    const discordId = interaction.user.id;
    // gameService
    //   .getInstance()
    //   .userUseCard(parseInt(assignId), discordId, interaction);
  }
}
