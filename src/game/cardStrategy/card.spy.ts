import { Client } from "discord.js";
import { AssignedCard } from "../card";
import { Player } from "../player";
import { ICardStrategy } from "./cardStrategy";

export class SpyCard implements ICardStrategy {
  card: AssignedCard;
  constructor(card: AssignedCard) {
    this.card = card;
  }
  public async use(player: Player, client: Client): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
