import "reflect-metadata";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { handleSlashEvent, handleButtonEvent } from "./handlers";
import { registerCommand } from "./slashes";
import { connectDB } from "./entities";
import {
  cardRepository,
  userRepository,
  assignedCardRepository
} from "./repositories";
import { userImporterService, observerService } from "./services";
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
  DATABASE_NAME,
  OBSERVER_CHANNEL_ID
} = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once("ready", async () => {
  console.log("Bot ready!");
});

client.on("interactionCreate", (interaction) => {
  handleSlashEvent(interaction);
  handleButtonEvent(interaction);
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
  cardRepository.init();
  userRepository.init();
  assignedCardRepository.init();

  // services init
  observerService.init(client, OBSERVER_CHANNEL_ID as string);
  userImporterService.init(client, GUILD_ID as string);
  await client.login(process.env.BOT_TOKEN);
})();
