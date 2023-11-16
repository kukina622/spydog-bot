import {
  APIEmbed,
  ActionRowBuilder,
  ButtonBuilder,
  Client,
  JSONEncodable,
  TextChannel
} from "discord.js";

export interface INotifyObserverPayload {
  content: string;
  files?: string[];
}

export interface INotifyPlayerPayload {
  embed: APIEmbed | JSONEncodable<APIEmbed>;
  row: ActionRowBuilder<ButtonBuilder>;
  files: string[];
}

export class NotifyMessageService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public notifyObserver(channelID: string, payload: INotifyObserverPayload) {
    return (this.client.channels.cache.get(channelID) as TextChannel)?.send(
      payload
    );
  }

  public notifyShowPlayerCard(
    discordId: string,
    payload: INotifyPlayerPayload
  ) {
    return this.client.users.cache.get(discordId)?.send({
      embeds: [payload.embed],
      components: [payload.row],
      files: payload.files
    });
  }
}
