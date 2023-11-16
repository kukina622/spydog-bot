import { Client } from "discord.js";
import { AssignedCard } from "../card";
import { Player } from "../player";
import { ICardStrategy } from "./cardStrategy";
import { resolveCardUrl } from "../../utils/card";
import { observerService, NotifyMessageService } from "../../services";

export class SpyCard implements ICardStrategy {
  card: AssignedCard;
  constructor(card: AssignedCard) {
    this.card = card;
  }
  public async use(player: Player, client: Client): Promise<void> {
    const message = `${player.team}隊的間諜使用了`;
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
