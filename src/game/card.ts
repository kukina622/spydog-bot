import { assignedCard } from "../entities/assignedCard";
import { CardType } from "../entities/cards";

export class AssignedCard {
  public readonly assignId: Number;
  public readonly cid: number;
  public readonly cardName: string;
  public readonly cardUrl: string;
  public readonly hiddenUse: boolean;
  public readonly type: CardType;
  public readonly typeDescription: string;
  public readonly isUsed: Boolean;

  constructor(
    cid: number,
    cardName: string,
    cardUrl: string,
    hiddenUse: boolean,
    type: CardType,
    assignId: Number,
    isUsed: Boolean
  ) {
    this.cid = cid;
    this.cardName = cardName;
    this.cardUrl = cardUrl;
    this.hiddenUse = hiddenUse;
    this.type = type;
    this.typeDescription = this.getTypeDescription(type);
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
}
