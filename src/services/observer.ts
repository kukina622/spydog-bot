import { Client } from "discord.js";

export class observerService {
  private static instance: observerService;
  private constructor(private client: Client) {}
  public static init(client: Client) {
    if (this.instance === undefined) {
      this.instance = new observerService(client);
    }
  }
  public static getInstance(): observerService {
    return this.instance;
  }
}
