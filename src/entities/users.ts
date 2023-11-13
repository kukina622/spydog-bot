import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { assignedCard } from "./assignedCard";
@Entity()
export class users {
  @PrimaryGeneratedColumn("increment")
  uid: number;

  @Column({
    type: "mediumtext",
    nullable: true,
    default: "NULL",
    collation: "utf8mb4_unicode_ci"
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    default: "NULL",
    unique: true
  })
  discord_id: string;

  @Column({ default: false })
  is_spy: boolean;

  @Column({
    type: "varchar",
    length: 10,
    nullable: true,
    default: "NULL"
  })
  team: string;

  @OneToMany((type) => assignedCard, (Assigned_Card) => Assigned_Card.users)
  assigned_card: assignedCard[];

  constructor(param: users = {} as users) {
    const { uid, name, discord_id, is_spy, assigned_card, team } = param;
    this.uid = uid;
    this.name = name;
    this.discord_id = discord_id;
    this.is_spy = is_spy;
    this.assigned_card = assigned_card;
    this.team = team;
  }
}
