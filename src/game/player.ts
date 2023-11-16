import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  Client,
  EmbedBuilder
} from "discord.js";
import { users } from "../entities/users";
import { assignedCardRepository } from "../repositories";
import { AssignedCard } from "./card";
import { CardType } from "../entities/cards";
import { NotifyMessageService } from "../services";

export class Player {
  public readonly discordId: string;
  public readonly name: string;
  public readonly isSpy: boolean;
  public readonly team: string;
  public readonly cards: AssignedCard[];

  constructor(
    discordId: string,
    name: string,
    isSpy: boolean,
    team: string,
    cards: AssignedCard[]
  ) {
    this.discordId = discordId;
    this.name = name;
    this.isSpy = isSpy;
    this.team = team;
    this.cards = cards;
  }

  public async listCards(client: Client): Promise<void> {
    const cards = this.cards.filter((x) => !x.isUsed);
    const spyCards = cards.filter((x) => x.type === CardType.SPY);
    const normalCards = cards.filter((x) => x.type === CardType.NORMAL);
    const cueCards = cards.filter((x) => x.type === CardType.CUE);
    await this.batchListCards(normalCards, false, client);
    await this.batchListCards(cueCards, false, client);
    if (this.isSpy) await this.batchListCards(spyCards, true, client);
  }

  private async batchListCards(
    cards: AssignedCard[],
    spy = false,
    client: Client
  ) {
    for (let i = 0; i < cards.length; i += 5) {
      const { files, embed, row } = this.getBatchListCardDetail(
        cards.slice(i, i + 5),
        spy
      );
      await new NotifyMessageService(client).notifyShowPlayerCard(
        this.discordId,
        { embed, row, files }
      );
    }
  }

  private getBatchListCardDetail(cards: AssignedCard[], spy = false) {
    const files = cards.map((x) => x.cardUrl);
    let counter = 97;

    const messageButtonList: ButtonBuilder[] = [];
    let description: string = "";
    for (const card of cards) {
      const button = new ButtonBuilder()
        .setCustomId(`assign_id:${card.assignId}`)
        .setLabel(`${String.fromCharCode(counter).toUpperCase()}`)
        .setStyle(ButtonStyle.Primary);

      messageButtonList.push(button);
      description += `:regional_indicator_${String.fromCharCode(counter)}: ${
        card.cardName
      }\n`;
      counter++;
    }

    const embed = new EmbedBuilder()
      .setTitle(
        spy ? "以下為間諜卡，使用時將會匿名發動" : "點選下列按鈕，以使用卡片"
      )
      .setColor(spy ? "#D53B3E" : "#0099ff")
      .setDescription(description);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      messageButtonList
    );
    return { files, embed, row };
  }

  public async useCard(assignId: number, client: Client): Promise<void> {
    const card = this.cards.find((x) => x.assignId === assignId);
    if (!card) throw new Error("卡片使用失敗");
    if (card.isUsed) throw new Error("該卡片已被使用");

    card.use(this, client);
    await assignedCardRepository
      .getInstance()
      .updateIsUsedByAssignId(card.assignId, true);
  }

  public static async fromUserEntity(user: users): Promise<Player> {
    const assignedCards = await assignedCardRepository
      .getInstance()
      .getAssignedCardsByDiscordId(user.discord_id);

    return new Player(
      user.discord_id,
      user.name,
      user.is_spy,
      user.team,
      assignedCards.map((x) => AssignedCard.fromAssignedCardEntity(x))
    );
  }
}
