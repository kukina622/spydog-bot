import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { cards } from "./cards";
import { users } from "./users";

@Entity()
export class assigned_card {
  @PrimaryGeneratedColumn("increment")
  assign_id: number;

  @ManyToOne(() => users, (Users) => Users.assigned_card)
  @JoinColumn({ name: "uid" })
  users: users;

  @ManyToOne(() => cards, (Cards) => Cards.assigned_card)
  @JoinColumn({ name: "cid" })
  cards: cards;

  constructor(param: assigned_card = {} as assigned_card) {
    const { assign_id, users, cards } = param;
    this.assign_id = assign_id;
    this.users = users;
    this.cards = cards;
  }
}
