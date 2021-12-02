import { Client, MessageActionRow, MessageEmbed } from "discord.js";

interface ImessagePayload {
  embed: MessageEmbed;
  row: MessageActionRow;
  files: string[];
  client: Client;
}

export class sendCardsService {
  public embed: MessageEmbed;
  public row: MessageActionRow;
  public files: string[];
  private client: Client;
  constructor({ embed, row, files, client }: ImessagePayload) {
    this.embed = embed;
    this.row = row;
    this.files = files;
    this.client = client;
  }
  public async send(discordId: string) {
    if (this.files.length <= 0) return;
    return this.client.users.cache.get(discordId)?.send({
      embeds: [this.embed],
      components: [this.row],
      files: this.files
    });
  }
}
