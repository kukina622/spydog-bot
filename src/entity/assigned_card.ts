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

  @Column({ default: false })
  is_used: boolean;

  @Column({ default: false })
  is_spycard: boolean;

  constructor(param: assigned_card = {} as assigned_card) {
    const { assign_id, users, cards, is_used, is_spycard } = param;
    this.assign_id = assign_id;
    this.users = users;
    this.cards = cards;
    this.is_used = is_used;
    this.is_spycard = is_spycard;
  }
}
