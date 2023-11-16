import { NotifyMessageService } from "../../services";
import { observerService } from "../../services/observer";
import { resolveCardUrl } from "../../utils/card";
import { AssignedCard } from "../card";
import { Player } from "../player";
import { ICardStrategy } from "./cardStrategy";
import { Client } from "discord.js";

export class NormalCard implements ICardStrategy {
  card: AssignedCard;
  constructor(card: AssignedCard) {
    this.card = card;
  }

  public async use(player: Player, client: Client): Promise<void> {
    const message = `<@${player.discordId}>使用了`;
    const payload = {
      content: message,
      files: [resolveCardUrl(this.card.cardUrl, this.card.hiddenUse)]
    };
    await observerService.getInstance().notify(player, this.card);
    await new NotifyMessageService(client).notifyUsedCard(
      process.env.CHANNEL_ID as string,
      payload
    );
  }
}
