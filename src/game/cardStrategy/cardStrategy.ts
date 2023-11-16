import { Client } from "discord.js";
import { AssignedCard } from "../card";
import { Player } from "../player";

export interface ICardStrategy {
  card: AssignedCard;
  use(player: Player, client: Client): Promise<void>;
}
