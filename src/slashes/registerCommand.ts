import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import startgame from "./startGame";
const commands_all = [startgame];

let rest: REST;

interface registerInfo {
  BOT_TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID?: string;
}

async function clearCommand(registerInfo: registerInfo) {
  const { CLIENT_ID, GUILD_ID } = registerInfo;
  console.log("Clearing slash commands...");
  if (GUILD_ID === undefined) {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: {} });
  } else {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: {}
    });
  }
  console.log("Successfully cleared.");
}

export async function registerCommand(registerInfo: registerInfo) {
  const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = registerInfo;
  rest = new REST({ version: "9" }).setToken(BOT_TOKEN);
  // clear old command
  // await clearCommand(registerInfo);
  // register new command
  console.log("Started refreshing application (/) commands.");
  if (GUILD_ID === undefined) {
    const commands = commands_all.filter((x) => x.global).map((x) => x.command);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  } else {
    const commands = commands_all
      .filter((x) => !x.global)
      .map((x) => x.command);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands
    });
  }
  console.log("Successfully reloaded application (/) commands.");
}
