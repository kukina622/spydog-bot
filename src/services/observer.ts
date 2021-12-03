import { Client, TextChannel } from "discord.js";
import { assigned_card } from "../entities/assigned_card";
import { gameState } from "./game";
export class observerService {
  private static instance: observerService;
  private client: Client;
  private OBSERVER_CHANNEL_ID: string;
  private constructor(client: Client, OBSERVER_CHANNEL_ID: string) {
    this.client = client;
    this.OBSERVER_CHANNEL_ID = OBSERVER_CHANNEL_ID;
  }
  public static init(client: Client) {
    if (this.instance === undefined) {
      const { OBSERVER_CHANNEL_ID } = process.env;
      this.instance = new observerService(client, <string>OBSERVER_CHANNEL_ID);
    }
  }
  public static getInstance(): observerService {
    return this.instance;
  }
  public async notify({ users, cards }: assigned_card) {
    let today = new Date();
    const sendContent = {
      content: `使用者:${users.name}\n卡片名稱:${cards.card_name}\n類別:${
        cards.is_spycard ? "間諜卡" : "一般卡"
      }\n隱藏發動:${
        cards.hidden_use
      }\n使用時間:${today.getHours()}:${today.getMinutes()}`,
      files: [cards.card_url]
    };
    await (
      this.client.channels.cache.get(this.OBSERVER_CHANNEL_ID) as TextChannel
    )?.send(sendContent);
  }
  public async gameStateChange(state: gameState) {
    let stateName: string = "";
    switch (+state) {
      case gameState.notYetStart:
        stateName = "尚未開始";
        break;
      case gameState.start:
        stateName = "已開始";
        break;
      case gameState.stop:
        stateName = "暫停";
        break;
    }
    await (
      this.client.channels.cache.get(this.OBSERVER_CHANNEL_ID) as TextChannel
    )?.send(`遊戲狀態已改變\n目前狀態: ${stateName}`);
  }
}
