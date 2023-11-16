import { AssignedCard } from "../card";
import { Player } from "../player";
import { ICardStrategy } from "./cardStrategy";
import { Client } from "discord.js";

export class CueCard implements ICardStrategy {
  card: AssignedCard;
  constructor(card: AssignedCard) {
    this.card = card;
  }

  public async use(player: Player, client: Client): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
