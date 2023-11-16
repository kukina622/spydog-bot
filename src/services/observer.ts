import { Client } from "discord.js";
import { assignedCard } from "../entities/assignedCard";
import { NotifyMessageService } from "./notify";
import { AssignedCard, Player } from "../game";
import { users } from "../entities/users";

export class observerService {
  private static instance: observerService;
  private client: Client;
  private OBSERVER_CHANNEL_ID: string;

  private constructor(client: Client, OBSERVER_CHANNEL_ID: string) {
    this.client = client;
    this.OBSERVER_CHANNEL_ID = OBSERVER_CHANNEL_ID;
  }

  public static init(client: Client, OBSERVER_CHANNEL_ID: string) {
    if (this.instance === undefined) {
      this.instance = new observerService(client, <string>OBSERVER_CHANNEL_ID);
    }
  }

  public static getInstance(): observerService {
    return this.instance;
  }

  public notify(player: Player, card: AssignedCard) {
    const today = new Date();
    const content =
      `使用者: ${player.name}\n` +
      `卡片名稱: ${card.cardName}\n` +
      `類別: ${card.typeDescription}\n` +
      `隱藏發動: ${card.hiddenUse}\n` +
      `使用時間: ${today.getHours()}:${today.getMinutes()}`;

    const payload = {
      content: content.replace("/\n+/", "\n"),
      files: [card.cardUrl]
    };
    return new NotifyMessageService(this.client).notifyObserver(
      this.OBSERVER_CHANNEL_ID,
      payload
    );
  }
}
