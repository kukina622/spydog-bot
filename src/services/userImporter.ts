import { Client } from "discord.js";
import { userRepository } from "../repositories";

export class userImporterService {
  private static instance: userImporterService;
  private client: Client;
  private GUILD_ID: string;
  private roleName: string = "一年級";

  constructor(client: Client, GUILD_ID: string) {
    this.client = client;
    this.GUILD_ID = GUILD_ID;
  }

  public static init(client: Client, GUILD_ID: string) {
    if (this.instance === undefined) {
      this.instance = new userImporterService(client, GUILD_ID);
    }
  }

  public static getInstance(): userImporterService {
    return this.instance;
  }

  public async autoImportAllUser() {
    const guild = await this.client.guilds.fetch(this.GUILD_ID);
    const roles = await guild.roles.fetch();
    const targetRole = roles.find((role) => role.name === this.roleName);

    const userData = targetRole?.members.map((member) => {
      return {
        discord_id: member.user.id,
        name: member.nickname || member.user.globalName || member.user.username
      };
    });
    if (!userData) return;
    return userRepository.getInstance().createUsers(userData);
  }
}
