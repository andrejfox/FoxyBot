import { GatewayIntentBits } from "discord.js";
import { ExtendedClient } from "djs-handlers";
import { config } from "./config/config.js";
import { projectPaths } from "./util/projectPaths.js";

export const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
});

client.start({
  botToken: config.botToken,
  guildID: config.guildID, //global or config.guildID
  commandsPath: projectPaths.commands,
  eventsPath: projectPaths.events,
  globalCommands: false,
  registerCommands: true,
  type: "module",
});
