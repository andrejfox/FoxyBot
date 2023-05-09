import { time } from "discord.js";

function isNumber(str) {
  return /^\d+$/.test(str);
}

export function getEmojis(emojiArr, client) {
  let emojis = [];

  for (const emoji of emojiArr) {
    emojis.push(isNumber(emoji) ? client.emojis.cache.get(emoji) : emoji);
  }

  return emojis;
}

export async function getTextChannelFromID(guild, channelID) {
  const fetchedChannel = await guild.channels.fetch(channelID);

  if (!fetchedChannel) {
    throw new Error("Failed to fetch text channel!");
  }

  return fetchedChannel;
}
