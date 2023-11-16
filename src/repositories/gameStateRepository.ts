import { getRepository, Repository } from "typeorm";
import { gameState, State } from "../entities/gameState";

export class gameStateRepository {
  private static instance: gameStateRepository;
  public readonly repo: Repository<gameState>;

  private constructor() {
    this.repo = getRepository(gameState);
  }

  public static init() {
    if (this.instance === undefined) {
      this.instance = new gameStateRepository();
    }
  }

  public static getInstance(): gameStateRepository {
    return this.instance;
  }

  public getCurrentState(): Promise<gameState | undefined> {
    return this.repo.findOne();
  }

  public async createGameState(state: State, description: string) {
    const entity = this.repo.create({
      state,
      description
    });
    await this.repo.insert(entity);
    return entity;
  }

  public async updateGameState(state: State, description: string) {
    return this.repo
      .createQueryBuilder()
      .update(gameState)
      .set({ state, description })
      .execute();
  }
}
