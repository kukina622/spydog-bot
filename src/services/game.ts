import { Client } from "discord.js";
import { gameStateRepository, userRepository } from "../repositories";
import { Player } from "../game";
import { CardType } from "../entities/cards";
import { State } from "../entities/gameState";

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
    if (!(await this.checkGameState(State.STARTING))) {
      throw new Error("遊戲尚未開始");
    }

    const users = await userRepository.getInstance().getAllUsers();
    for (const user of users) {
      const player = await Player.fromUserEntity(user);
      await player.listCards(this.client);
    }
  }

  public async listUserCards(discordId: string): Promise<void> {
    if (!(await this.checkGameState(State.STARTING))) {
      throw new Error("遊戲尚未開始");
    }

    const user = await userRepository
      .getInstance()
      .getUserByDiscordId(discordId);
    if (!user) throw new Error("找不到該用戶");

    const player = await Player.fromUserEntity(user);
    await player.listCards(this.client);
  }

  public async useCard(discordId: string, assignId: number): Promise<void> {
    if (!(await this.checkGameState(State.STARTING))) {
      throw new Error("遊戲尚未開始");
    }

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
    if (!(await this.checkGameState(State.STARTING))) return;

    const users = await userRepository.getInstance().getAllUsers();
    for (const user of users) {
      const player = await Player.fromUserEntity(user);
      const [card] = await player.randomAssignCard(CardType.NORMAL, 1);
      await player.listCardByAssignId(card.assign_id, this.client);
    }
  }

  public async setGameState(state: State) {
    const currentState = await gameStateRepository
      .getInstance()
      .getCurrentState();
    const description = this.getStateDescription(state);
    if (!currentState) {
      await gameStateRepository
        .getInstance()
        .createGameState(state, description);
      return;
    }

    await gameStateRepository.getInstance().updateGameState(state, description);
  }

  private getStateDescription(state: State) {
    switch (state) {
      case State.PENDING:
        return "尚未開始";
      case State.STARTING:
        return "進行中";
      case State.PAUSE:
        return "暫停中";
    }
  }

  private async checkGameState(state: State) {
    const currentState = await gameStateRepository
      .getInstance()
      .getCurrentState();
    return currentState?.state === state;
  }
}
