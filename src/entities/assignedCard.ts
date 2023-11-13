import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { cards } from "./cards";
import { users } from "./users";

@Entity("assigned_card")
export class assignedCard {
  @PrimaryGeneratedColumn("increment")
  assign_id: number;

  @ManyToOne(() => users, (Users) => Users.assigned_card)
  @JoinColumn({ name: "uid" })
  users: users;

  @ManyToOne(() => cards, (Cards) => Cards.assigned_card)
  @JoinColumn({ name: "cid" })
  cards: cards;

  @Column({ default: false })
  is_used: boolean;

  constructor(param: assignedCard = {} as assignedCard) {
    const { assign_id, users, cards, is_used } = param;
    this.assign_id = assign_id;
    this.users = users;
    this.cards = cards;
    this.is_used = is_used;
  }
}
