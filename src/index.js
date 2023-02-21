import { GatewayIntentBits } from "discord.js";
import { ExtendedClient } from "djs-handlers";
import { config } from "./config/config.js";

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
  guildID: config.guildID,
  commandsPath: config.commandsPath,
  eventsPath: config.eventsPath,
  globalCommands: false,
  registerCommands: true,
  type: "module",
});
