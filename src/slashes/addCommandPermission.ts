import { Client, GuildApplicationCommandPermissionData } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

interface Icommand {
  id: string;
  application_id: string;
  version: string;
  default_permission: boolean;
  default_member_permissions: any;
  type: number;
  name: string;
  description: string;
  guild_id: string;
}
interface Ipermission {
  id: string;
  type: string;
  permission: boolean;
}

interface IcommandPermission {
  id: string;
  permissions: Ipermission[];
}

export async function addCommandPermission(client: Client) {
  const { GUILD_ID, BOT_TOKEN, CLIENT_ID, ADMIN_ID } = process.env;
  // get all admin
  const adminIdList: string[] = ADMIN_ID?.split(" ") as string[];
  let rest: REST;
  rest = new REST({ version: "9" }).setToken(<string>BOT_TOKEN);
  // get all command information
  const fetchCommands: Icommand[] = (await rest.get(
    Routes.applicationGuildCommands(<string>CLIENT_ID, <string>GUILD_ID)
  )) as Icommand[];
  // filter admin command
  const adminCommands = fetchCommands.filter(
    (command: Icommand) => !command.default_permission
  );
  let fullPermissions: IcommandPermission[] = [];
  for (const adminCommand of adminCommands) {
    let permissions: Ipermission[] = [];
    adminIdList.forEach((adminId) => {
      permissions.push({
        id: adminId,
        type: "USER",
        permission: true
      } as Ipermission);
    });
    fullPermissions.push({
      id: adminCommand.id,
      permissions: permissions
    });
  }
  await client.guilds.cache
    .get(<string>GUILD_ID)
    ?.commands.permissions.set({ fullPermissions: fullPermissions as any });
}
