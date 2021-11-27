import "reflect-metadata";
import { Client } from "discord.js";
import {
  messageEvent,
  interactionSlashEvent,
  interactionButtonEvent
} from "./events";
import { registerCommand } from "./slashes";
import { connectDB } from "./entity";
import { assignedCardRepo, cardRepo, userRepo } from "./repositories";
import { gameService } from "./services";
import { config as importenv } from "dotenv-flow";
importenv();
const {
  BOT_TOKEN,
  CLIENT_ID,
  GUILD_ID,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME
} = process.env;

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
  partials: ["CHANNEL"]
});

client.once("ready", () => {
  console.log("Bot ready!");
});

client.on("messageCreate", (message) => {
  messageEvent(message);
});

client.on("interactionCreate", (interaction) => {
  interactionSlashEvent(interaction);
  interactionButtonEvent(interaction);
});

(async function () {
  await connectDB({
    DATABASE_HOST: <string>DATABASE_HOST,
    DATABASE_PORT: parseInt(<string>DATABASE_PORT),
    DATABASE_USERNAME: <string>DATABASE_USERNAME,
    DATABASE_PASSWORD: <string>DATABASE_PASSWORD,
    DATABASE_NAME: <string>DATABASE_NAME
  });
  await registerCommand({
    BOT_TOKEN: <string>BOT_TOKEN,
    CLIENT_ID: <string>CLIENT_ID,
    GUILD_ID
  });
  // repositories init
  assignedCardRepo.init();
  cardRepo.init();
  userRepo.init();
  // services init
  gameService.init(client);
  await client.login(process.env.BOT_TOKEN);
})();
