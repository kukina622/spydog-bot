import { getRepository, Repository } from "typeorm";
import { assignedCard } from "../entities/assignedCard";

export class assignedCardRepository {
  private static instance: assignedCardRepository;
  public repo: Repository<assignedCard>;
  private constructor() {
    this.repo = getRepository(assignedCard);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new assignedCardRepository();
    }
  }
  public static getInstance(): assignedCardRepository {
    return this.instance;
  }
  public getAssignedCards(): Promise<assignedCard[]> {
    return this.repo
      .createQueryBuilder("ac")
      .innerJoinAndSelect("ac.cards", "c")
      .innerJoinAndSelect("ac.users", "u")
      .orderBy("ac.assign_id")
      .getMany();
  }
  public getAssignedCardsByAssignIdAndDiscordId(
    assignId: number,
    discordId: string
  ) {
    return this.repo
      .createQueryBuilder("ac")
      .innerJoinAndSelect("ac.cards", "c")
      .innerJoinAndSelect("ac.users", "u")
      .where("ac.assign_id = :assign_id", { assign_id: assignId })
      .andWhere("u.discord_id = :discord_id", { discord_id: discordId })
      .orderBy("ac.assign_id")
      .getOne();
  }
  public getAssignedCardsByDiscordId(discordId: string) {
    return this.repo
      .createQueryBuilder("ac")
      .innerJoinAndSelect("ac.cards", "c")
      .innerJoinAndSelect("ac.users", "u")
      .where("u.discord_id = :discord_id", { discord_id: discordId })
      .orderBy("ac.assign_id")
      .getMany();
  }
  public updateIsUsedByAssignId(assignId: number, is_used: boolean) {
    return this.repo
      .createQueryBuilder()
      .update(assignedCard)
      .set({ is_used })
      .where("assign_id = :assign_id", { assign_id: assignId })
      .execute();
  }
}
