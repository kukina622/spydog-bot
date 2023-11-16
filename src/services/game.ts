import { Client } from "discord.js";
import { userRepository } from "../repositories";
import { Player } from "../game";
import { CardType } from "../entities/cards";

export class gameService {
  private static instance: gameService;
  private client: Client;

  private constructor(client: Client) {
    this.client = client;
  }

  public static getInstance(): gameService {
    return this.instance;
  }

  public static init(client: Client) {
    if (this.instance === undefined) {
      this.instance = new gameService(client);
    }
  }

  public async listAllUserCards(): Promise<void> {
    const users = await userRepository.getInstance().getAllUsers();
    for (const user of users) {
      const player = await Player.fromUserEntity(user);
      await player.listCards(this.client);
    }
  }

  public async listUserCards(discordId: string): Promise<void> {
    const user = await userRepository
      .getInstance()
      .getUserByDiscordId(discordId);
    if (!user) throw new Error("找不到該用戶");

    const player = await Player.fromUserEntity(user);
    await player.listCards(this.client);
  }

  public async useCard(discordId: string, assignId: number): Promise<void> {
    const user = await userRepository
      .getInstance()
      .getUserByDiscordId(discordId);
    if (!user) throw new Error("找不到該用戶");

    const player = await Player.fromUserEntity(user);
    await player.useCard(assignId, this.client);
  }

  public async startGameWithRandomAssignCard() {
    const users = await userRepository.getInstance().getAllUsers();
    for (const user of users) {
      const player = await Player.fromUserEntity(user);
      await player.randomAssignCard(CardType.NORMAL, 3);
      await player.randomAssignCard(CardType.CUE, 2);
    }
  }

  public async cronJobWithRandomAssignCard() {
    const users = await userRepository.getInstance().getAllUsers();
    for (const user of users) {
      const player = await Player.fromUserEntity(user);
      const [card] = await player.randomAssignCard(CardType.NORMAL, 1);
      await player.listCardByAssignId(card.assign_id, this.client);
    }
  }
}
