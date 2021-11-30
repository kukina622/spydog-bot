import { getRepository, Repository } from "typeorm";
import { users } from "../entities/users";

export class userRepo {
  private static instance: userRepo;
  public repo: Repository<users>;
  private constructor() {
    this.repo = getRepository(users);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new userRepo();
    }
  }
  public static getInstance(): userRepo {
    return this.instance;
  }
  public getUserByDiscordId(discordId: string) {
    return this.repo
      .createQueryBuilder("u")
      .where("u.discord_id = :discord_id", { discord_id: discordId })
      .getOne();
  }
}
