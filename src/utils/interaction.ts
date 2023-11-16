import {
  APIButtonComponent,
  ActionRow,
  ButtonBuilder,
  ButtonInteraction,
  MessageActionRowComponent
} from "discord.js";

export const disableButtonByCustomId = (
  interaction: ButtonInteraction,
  customId: string
): ActionRow<MessageActionRowComponent> => {
  let row = interaction.message.components[0];
  (row.components as any) = row.components.map((button) =>
    button.customId === customId
      ? ButtonBuilder.from(button as APIButtonComponent).setDisabled(true)
      : button
  );

  return row;
};
