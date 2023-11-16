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

export interface INotifyUsedCard {
  content: string;
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

  public async notifyShowPlayerCard(
    discordId: string,
    payload: INotifyPlayerPayload
  ) {
    const user = await this.client.users.fetch(discordId);
    return user.send({
      embeds: [payload.embed],
      components: [payload.row],
      files: payload.files
    });
  }

  public notifyUsedCard(channelID: string, payload: INotifyUsedCard) {
    return (this.client.channels.cache.get(channelID) as TextChannel)?.send(
      payload
    );
  }
}
