import { getRepository, Repository } from "typeorm";
import { cards, CardType } from "../entities/cards";

export class cardRepository {
  private static instance: cardRepository;
  public repo: Repository<cards>;
  private constructor() {
    this.repo = getRepository(cards);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new cardRepository();
    }
  }
  public static getInstance(): cardRepository {
    return this.instance;
  }
  public async getCardsByCardType(type: CardType): Promise<cards[]> {
    return await this.repo.find({ where: { type } });
  }
}
