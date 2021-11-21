import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(param: users = {} as users) {
    const { uid, name, discord_id, is_spy } = param;
    this.uid = uid;
    this.name = name;
    this.discord_id = discord_id;
    this.is_spy = is_spy;
  }
}
