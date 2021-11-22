import { Client } from "discord.js";

export class gameService {
  private static instance: gameService;
  private constructor(private client: Client) {}
  public static init(client: Client) {
    if (this.instance === undefined) {
      this.instance = new gameService(client);
    }
  }
  public static getInstance(): gameService {
    return this.instance;
  }
  public startGame() {
    this.assignCard();
  }
  private assignCard() {}
}
