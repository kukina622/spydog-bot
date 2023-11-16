import { Client, GatewayIntentBits, Partials } from "discord.js";
import { connectDB } from "./entities";
import {
  cardRepository,
  userRepository,
  assignedCardRepository
} from "./repositories";
import { gameService } from "./services";
import { config as importenv } from "dotenv-flow";
import cron from "node-cron";

importenv();

const {
  BOT_TOKEN,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME
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
  console.log("Cron Job Bot ready!");

  cron.schedule("* */30 * * * *", () => {
    gameService.getInstance().cronJobWithRandomAssignCard();
  });
});

(async function () {
  await connectDB({
    DATABASE_HOST: <string>DATABASE_HOST,
    DATABASE_PORT: parseInt(<string>DATABASE_PORT),
    DATABASE_USERNAME: <string>DATABASE_USERNAME,
    DATABASE_PASSWORD: <string>DATABASE_PASSWORD,
    DATABASE_NAME: <string>DATABASE_NAME
  });

  // repositories init
  cardRepository.init();
  userRepository.init();
  assignedCardRepository.init();

  // services init
  gameService.init(client);

  await client.login(BOT_TOKEN);
})();
