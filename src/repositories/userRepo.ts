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
}
