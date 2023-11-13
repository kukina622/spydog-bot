import { getRepository, Repository } from "typeorm";
import { users } from "../entities/users";

export class userRepository {
  private static instance: userRepository;
  public repo: Repository<users>;
  private constructor() {
    this.repo = getRepository(users);
  }
  public static init() {
    if (this.instance === undefined) {
      this.instance = new userRepository();
    }
  }
  public static getInstance(): userRepository {
    return this.instance;
  }
  public getUserByDiscordId(discordId: string) {
    return this.repo
      .createQueryBuilder("u")
      .where("u.discord_id = :discord_id", { discord_id: discordId })
      .getOne();
  }

  public createUsers(users: { discord_id: string; name: string }[]) {
    return this.repo.insert(users);
  }
}
