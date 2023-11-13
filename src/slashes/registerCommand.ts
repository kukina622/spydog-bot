import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import startgame from "./startGame";
import listCard from "./listCard";
import stopGame from "./stopGame";
import restartGame from "./restartGame";

const COMMANDS = [startgame, listCard, stopGame, restartGame];

interface registerInfo {
  BOT_TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID?: string;
}

export async function registerCommand({
  BOT_TOKEN,
  CLIENT_ID,
  GUILD_ID
}: registerInfo) {
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  const commands = {
    guild: COMMANDS.filter((x) => x.guild).map((x) => x.command),
    global: COMMANDS.filter((x) => !x.guild).map((x) => x.command)
  };

  try {
    console.log("Started refreshing application (/) commands.");
    if (GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands.guild
      });
    }
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands.global
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
