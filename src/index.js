import { GatewayIntentBits, Partials } from "discord.js";
import { ExtendedClient } from "djs-handlers";
import { config } from "./config/config.js";

export const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
  partials: [Partials.GuildMember],
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
