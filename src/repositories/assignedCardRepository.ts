import { getRepository, Repository } from "typeorm";
import { assigned_card } from "../entities/assigned_card";

export class assignedCardRepository {
  private static instance: assignedCardRepository;
  public repo: Repository<assigned_card>;
  private constructor() {
    this.repo = getRepository(assigned_card);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new assignedCardRepository();
    }
  }
  public static getInstance(): assignedCardRepository {
    return this.instance;
  }
  public getAssignedCards(): Promise<assigned_card[]> {
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
      .update(assigned_card)
      .set({ is_used })
      .where("assign_id = :assign_id", { assign_id: assignId })
      .execute();
  }
}
