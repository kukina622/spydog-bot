import { getRepository, Repository } from "typeorm";
import { assigned_card } from "../entities/assigned_card";

export class assignedCardRepo {
  private static instance: assignedCardRepo;
  public repo: Repository<assigned_card>;
  private constructor() {
    this.repo = getRepository(assigned_card);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new assignedCardRepo();
    }
  }
  public static getInstance(): assignedCardRepo {
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
}
