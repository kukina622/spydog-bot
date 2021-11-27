import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { assigned_card } from "./assigned_card";
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
    default: "NULL"
  })
  discord_id: string;

  @Column({ default: false })
  is_spy: boolean;

  @OneToMany((type) => assigned_card, (Assigned_Card) => Assigned_Card.users)
  assigned_card: assigned_card[];

  constructor(param: users = {} as users) {
    const { uid, name, discord_id, is_spy, assigned_card } = param;
    this.uid = uid;
    this.name = name;
    this.discord_id = discord_id;
    this.is_spy = is_spy;
    this.assigned_card = assigned_card;
  }
}
