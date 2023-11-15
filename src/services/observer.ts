import { Client } from "discord.js";
import { assignedCard } from "../entities/assignedCard";
import { NotifyMessageService } from "./notify";

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

  public notify({ cards, users }: assignedCard) {
    const today = new Date();
    const payload = {
      content: `
        使用者:${users.name}\n
        卡片名稱:${cards.card_name}\n
        類別:${cards.type}\n
        隱藏發動:${cards.hidden_use}\n
        使用時間:${today.getHours()}:${today.getMinutes()}`,
      files: [cards.card_url]
    };
    return new NotifyMessageService(this.client).notifyObserver(
      this.OBSERVER_CHANNEL_ID,
      payload
    );
  }
}
