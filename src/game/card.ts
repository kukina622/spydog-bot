import { Client } from "discord.js";
import { assignedCard } from "../entities/assignedCard";
import { CardType } from "../entities/cards";
import { CueCard, ICardStrategy, NormalCard, SpyCard } from "./cardStrategy";
import { Player } from "./player";

export class AssignedCard {
  public readonly assignId: number;
  public readonly cid: number;
  public readonly cardName: string;
  public readonly cardUrl: string;
  public readonly hiddenUse: boolean;
  public readonly type: CardType;
  public readonly typeDescription: string;
  public readonly isUsed: Boolean;

  private cardStrategy: ICardStrategy;

  constructor(
    cid: number,
    cardName: string,
    cardUrl: string,
    hiddenUse: boolean,
    type: CardType,
    assignId: number,
    isUsed: Boolean
  ) {
    this.cid = cid;
    this.cardName = cardName;
    this.cardUrl = cardUrl;
    this.hiddenUse = hiddenUse;
    this.type = type;
    this.typeDescription = this.getTypeDescription(type);
    this.cardStrategy = this.getStrategy(type);
    this.assignId = assignId;
    this.isUsed = isUsed;
  }

  static fromAssignedCardEntity(card: assignedCard): AssignedCard {
    return new AssignedCard(
      card.cards.cid,
      card.cards.card_name,
      card.cards.card_url,
      card.cards.hidden_use,
      card.cards.type,
      card.assign_id,
      card.is_used
    );
  }

  public getTypeDescription(type: CardType): string {
    switch (type) {
      case CardType.NORMAL:
        return "一般卡";
      case CardType.CUE:
        return "提示卡";
      case CardType.SPY:
        return "間諜卡";
      default:
        return "未知";
    }
  }

  private getStrategy(type: CardType): ICardStrategy {
    switch (type) {
      case CardType.NORMAL:
        return new NormalCard(this);
      case CardType.CUE:
        return new CueCard(this);
      case CardType.SPY:
        return new SpyCard(this);
    }
  }

  public use(player: Player, client: Client): void {
    this.cardStrategy?.use(player, client);
  }
}
