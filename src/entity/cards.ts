import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

  constructor(param: cards = {} as cards) {
    const { cid, card_name, card_url } = param;
    this.cid = cid;
    this.card_name = card_name;
    this.card_url = card_url;
  }
}
