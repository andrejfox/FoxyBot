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
