import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
  ButtonInteraction,
  CacheType,
  CommandInteraction
} from "discord.js";
import { assigned_card } from "../entities/assigned_card";
import { users } from "../entities/users";
import { assignedCardRepo } from "../repositories/assignedCardRepo";
import { userRepo } from "../repositories/userRepo";
import { observerService } from "./observer";
import { sendCardsService } from "./sendCards";

export enum gameState {
  "notYetStart",
  "start",
  "stop"
}
export class gameService {
  private static instance: gameService;
  private state: gameState = gameState.notYetStart;
  private constructor(private client: Client) {}
  public static init(client: Client) {
    if (this.instance === undefined) {
      this.instance = new gameService(client);
    }
  }
  public static getInstance(): gameService {
    return this.instance;
  }
  public async startGame() {
    this.state = gameState.start;
    await observerService.getInstance().gameStateChange(this.state);
    await this.sendAssignedCards();
  }
  private async sendAssignedCards() {
    if (!this.stateCheck(gameState.start)) return;
    const assignedCards = await assignedCardRepo
      .getInstance()
      .getAssignedCards();
    const users_all = assignedCards.map(({ users }) => users);
    const discordId_all = users_all.map(({ discord_id }) => discord_id);
    const discordIdSet = new Set(discordId_all);
    for (let discordId of discordIdSet) {
      // filter specified discordId data
      const assignedCardsOfDiscordId = assignedCards.filter(
        ({ users: { discord_id } }) => discord_id === discordId
      );
      const { is_spy } = users_all.find(
        (user) => user.discord_id === discordId
      ) as users;

      if (is_spy) {
        let assignedCardsOfDiscordId_spy = assignedCardsOfDiscordId.filter(
          (assignedCard) => assignedCard.cards.is_spycard
        );
        for (let i = 0; i < assignedCardsOfDiscordId_spy.length; i += 5) {
          const { files, embed, row } = this.getSendAssignedCardsInfo(
            assignedCardsOfDiscordId_spy.slice(i, i + 5),
            is_spy
          );
          const sendSpyCards = new sendCardsService({
            files,
            embed,
            row,
            client: this.client
          });
          await sendSpyCards.send(discordId);
        }
      }
      let assignedCardsOfDiscordId_notSpy = assignedCardsOfDiscordId.filter(
        (assignedCard) => !assignedCard.cards.is_spycard
      );
      for (let i = 0; i < assignedCardsOfDiscordId_notSpy.length; i += 5) {
        const { files, embed, row } = this.getSendAssignedCardsInfo(
          assignedCardsOfDiscordId_notSpy.slice(i, i + 5)
        );
        const sendNormalCards = new sendCardsService({
          files,
          embed,
          row,
          client: this.client
        });
        await sendNormalCards.send(discordId);
      }  
    }
  }
  private getSendAssignedCardsInfo(
    assignedCardsOfDiscordId: assigned_card[],
    spy = false
  ) {
    // filter which are spycard
    const assignedCardsOfDiscordId_filter = assignedCardsOfDiscordId.filter(
      ({ cards: { is_spycard } }) => (spy ? is_spycard : !is_spycard)
    );

    const files = assignedCardsOfDiscordId_filter.map(
      ({ cards: { card_url } }) => card_url
    );
    // filter which are spycard
    let counter = 97; // alphabet "a" ascii
    let messageButtonList: MessageButton[] = [];
    let description: string = ""; //messageEmbed description
    for (let assignedCard of assignedCardsOfDiscordId_filter) {
      const messageButton = new MessageButton()
        .setCustomId(`assign_id:${assignedCard.assign_id}`)
        .setLabel(`${String.fromCharCode(counter).toUpperCase()}`)
        .setStyle("PRIMARY");
      messageButtonList.push(messageButton);
      description += `:regional_indicator_${String.fromCharCode(counter)}: ${
        assignedCard.cards.card_name
      }\n`;
      counter++;
    }
    const embed = new MessageEmbed()
      .setTitle(
        spy ? "????????????????????????????????????????????????" : "????????????????????????????????????"
      )
      .setColor(spy ? "#D53B3E" : "#0099ff")
      .setDescription(description);
    const row = new MessageActionRow().addComponents(messageButtonList);
    return { files, embed, row };
  }
  public async userUseCard(
    assignId: number,
    discordId: string,
    interaction: ButtonInteraction<CacheType>
  ) {
    if (!this.stateCheck(gameState.start)) return;

    const { CHANNEL_ID } = process.env;
    const usedCardInfo = await assignedCardRepo
      .getInstance()
      .getAssignedCardsByAssignIdAndDiscordId(assignId, discordId);

    if (usedCardInfo === undefined) {
      return await interaction.reply("??????????????????");
    } else if (usedCardInfo.is_used) {
      return await interaction.reply("??????????????????");
    }
    // get MessageActionRow componet
    const rawComponents = (
      interaction.message.components as MessageActionRow[]
    )[0].components;
    // find the target
    const targetIndex = rawComponents.findIndex(
      (rawComponent) => rawComponent.customId === `assign_id:${assignId}`
    );
    // disable the button
    rawComponents[targetIndex].setDisabled(true);
    // update user button
    await interaction.update({
      components: [new MessageActionRow().addComponents(rawComponents)]
    });
    // update usage
    await assignedCardRepo.getInstance().updateIsUsedByAssignId(assignId, true);
    const { users, cards } = usedCardInfo;
    let messageContent = "";
    if (cards.is_spycard) {
      messageContent = `${users.team}?????????????????????`;
    } else if (cards.hidden_use) {
      messageContent = "?????????????????????";
    } else {
      messageContent = `<@${users.discord_id}>?????????`;
    }
    const sendContent = {
      content: messageContent,
      files: [
        cards.hidden_use ? "https://i.imgur.com/hHe3ulL.jpg" : cards.card_url
      ]
    };
    await observerService.getInstance().notify(usedCardInfo);
    return await (
      this.client.channels.cache.get(<string>CHANNEL_ID) as TextChannel
    )?.send(sendContent);
  }
  public async listNotUsedCards(
    discordId: string,
    interaction: CommandInteraction<CacheType>
  ) {
    if (!this.stateCheck(gameState.start)) return;

    const user: users | undefined = await userRepo
      .getInstance()
      .getUserByDiscordId(discordId);
    // check user existed
    if (user === undefined) return;
    const assignedCards_notused: assigned_card[] = (
      await assignedCardRepo
        .getInstance()
        .getAssignedCardsByDiscordId(discordId)
    ).filter((assignedCard) => !assignedCard.is_used);
    const { is_spy } = user;

    if (is_spy) {
      let assignedCards_notused_spy = assignedCards_notused.filter(
        (assignedCard) => assignedCard.cards.is_spycard
      );
      for (let i = 0; i < assignedCards_notused_spy.length; i += 5) {
        const { files, embed, row } = this.getSendAssignedCardsInfo(
          assignedCards_notused_spy.slice(i, i + 5),
          is_spy
        );
        const sendSpyCards = new sendCardsService({
          files,
          embed,
          row,
          client: this.client
        });
        await sendSpyCards.send(discordId);
      }
    }
    let assignedCards_notused_notSpy = assignedCards_notused.filter(
      (assignedCard) => !assignedCard.cards.is_spycard
    );
    for (let i = 0; i < assignedCards_notused_notSpy.length; i += 5) {
      const { files, embed, row } = this.getSendAssignedCardsInfo(
        assignedCards_notused_notSpy.slice(i, i + 5)
      );
      const sendNormalCards = new sendCardsService({
        files,
        embed,
        row,
        client: this.client
      });
      await sendNormalCards.send(discordId);
    }

    await interaction.editReply("??????????????????");
  }
  private stateCheck(state: gameState): boolean {
    if (this.state !== state) {
      return false;
    }
    return true;
  }
  public async setState(state: "restartgame" | "stopgame") {
    switch (state) {
      case "restartgame":
        this.state = gameState.start;
        break;
      case "stopgame":
        this.state = gameState.stop;
        break;
    }
    await observerService.getInstance().gameStateChange(this.state);
  }
}
