import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
  ButtonInteraction,
  CacheType
} from "discord.js";
import { assigned_card } from "../entities/assigned_card";
import { users } from "../entities/users";
import { assignedCardRepo } from "../repositories/assignedCardRepo";
export class gameService {
  private static instance: gameService;
  private constructor(private client: Client) {}
  public static init(client: Client) {
    if (this.instance === undefined) {
      this.instance = new gameService(client);
    }
  }
  public static getInstance(): gameService {
    return this.instance;
  }
  public async startGame() {
    await this.sendAssignedCards();
  }
  private async sendAssignedCards() {
    const assignedCards = await assignedCardRepo
      .getInstance()
      .getAssignedCards();
    const users_all = assignedCards.map(({ users }) => users);
    const discordId_all = users_all.map(({ discord_id }) => discord_id);
    const discordIdSet = new Set(discordId_all);
    for (let discordId of discordIdSet) {
      // filter specified discordId data
      const assignedCardsOfDiscordId = assignedCards.filter(
        ({ users: { discord_id } }) => discord_id === discordId
      );
      const { is_spy } = users_all.find(
        (user) => user.discord_id === discordId
      ) as users;

      if (is_spy) {
        // get spy's sendAssignedCardsInfo
        const { files, embed, row } = this.getSendAssignedCardsInfo(
          assignedCardsOfDiscordId,
          is_spy
        );
        if (files.length > 0) {
          await this.client.users.cache.get(discordId)?.send({
            embeds: [embed],
            components: [row],
            files: files
          });
        }
      }

      const { files, embed, row } = this.getSendAssignedCardsInfo(
        assignedCardsOfDiscordId
      );

      await this.client.users.cache.get(discordId)?.send({
        embeds: [embed],
        components: [row],
        files: files
      });
    }
  }
  private getSendAssignedCardsInfo(
    assignedCardsOfDiscordId: assigned_card[],
    spy = false
  ) {
    // filter which are spycard
    const assignedCardsOfDiscordId_filter = assignedCardsOfDiscordId.filter(
      ({ cards: { is_spycard } }) => (spy ? is_spycard : !is_spycard)
    );

    const files = assignedCardsOfDiscordId_filter.map(
      ({ cards: { card_url } }) => card_url
    );
    // filter which are spycard
    let counter = 97; // alphabet "a" ascii
    let messageButtonList: MessageButton[] = [];
    let description: string = ""; //messageEmbed description
    for (let assignedCard of assignedCardsOfDiscordId_filter) {
      const messageButton = new MessageButton()
        .setCustomId(`assign_id:${assignedCard.assign_id}`)
        .setLabel(`${String.fromCharCode(counter).toUpperCase()}`)
        .setStyle("PRIMARY");
      messageButtonList.push(messageButton);
      description += `:regional_indicator_${String.fromCharCode(counter)}: ${
        assignedCard.cards.card_name
      }\n`;
      counter++;
    }
    const embed = new MessageEmbed()
      .setTitle(
        spy ? "以下為間諜卡，使用時將會匿名發動" : "點選下列按鈕，以使用卡片"
      )
      .setColor(spy ? "#D53B3E" : "#0099ff")
      .setDescription(description);
    const row = new MessageActionRow().addComponents(messageButtonList);
    return { files, embed, row };
  }
  public async userUseCard(
    assignId: number,
    discordId: string,
    interaction: ButtonInteraction<CacheType>
  ) {
    const { CHANNEL_ID } = process.env;
    const usedCardInfo = await assignedCardRepo
      .getInstance()
      .getAssignedCardsByAssignIdAndDiscordId(assignId, discordId);

    if (usedCardInfo === undefined) {
      return await interaction.reply("卡片使用失敗");
    } else if (usedCardInfo.is_used) {
      return await interaction.reply("卡片已使用過");
    }

    const { users, cards } = usedCardInfo;
    let messageContent = "";
    if (cards.is_spycard) {
      messageContent = `${users.team}隊的間諜使用了`;
    } else if (cards.hidden_use) {
      messageContent = "某人使用了卡片";
    } else {
      messageContent = `<@${users.discord_id}>使用了`;
    }
    const sendContent = {
      content: messageContent,
      files: [
        cards.hidden_use ? "https://i.imgur.com/hHe3ulL.jpg" : cards.card_url
      ]
    };
    await interaction.deferUpdate();
    return await (
      this.client.channels.cache.get(<string>CHANNEL_ID) as TextChannel
    )?.send(sendContent);
  }
}
