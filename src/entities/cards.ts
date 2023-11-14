import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { assignedCard } from "./assignedCard";

export enum CardType {
  NORMAL = "normal",
  SPY = "spy",
  CUE = "cue"
}

@Entity()
export class cards {
  @PrimaryGeneratedColumn("increment")
  cid: number;

  @Column({
    type: "mediumtext",
    nullable: true,
    default: "NULL",
    collation: "utf8mb4_unicode_ci"
  })
  card_name: string;

  @Column({
    type: "mediumtext",
    nullable: true,
    default: "NULL"
  })
  card_url: string;

  @Column({ default: false })
  hidden_use: boolean;

  @Column({
    type: "enum",
    enum: CardType,
    default: CardType.NORMAL
  })
  type: CardType;

  @OneToMany((type) => assignedCard, (Assigned_Card) => Assigned_Card.cards)
  assigned_card: assignedCard[];

  constructor(param: cards = {} as cards) {
    const { cid, card_name, card_url, hidden_use, assigned_card, type } = param;
    this.cid = cid;
    this.card_name = card_name;
    this.card_url = card_url;
    this.hidden_use = hidden_use;
    this.assigned_card = assigned_card;
    this.type = type;
  }
}
