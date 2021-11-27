import { getRepository, Repository } from "typeorm";
import { cards } from "../entity/cards";

export class cardRepo {
  private static instance: cardRepo;
  public repo: Repository<cards>;
  private constructor() {
    this.repo = getRepository(cards);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new cardRepo();
    }
  }
  public static getInstance(): cardRepo {
    return this.instance;
  }
}
