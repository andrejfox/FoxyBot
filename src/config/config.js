import dotenv from "dotenv";

dotenv.config();

const envVariables = {
  botToken: process.env.BOT_TOKEN,
  clientID: process.env.CLIENT_ID,
  guildID: process.env.GUILD_ID,

  //general
  mainEmbedColour: 0x000000, //the hex value of the default Embed colour (note! only change what comes after 0x)
  erorEmbedColour: 0xff0000, //the hex value of the default Eror Embed colour (note! only change what comes after 0x)

  //join
  joinRolle: "0", //add join role id (just the numbers) ["0" = off]

  //poll stuff
  pollYes: "0", //add yes emote unicode || id (just the numbers) --- ["0" = default {⭕}]
  pollNo: "0", //add no emote unicode || id (just the numbers) --- ["0" = default {❌}]

  //add multi anwser emotes unicodes || ids (just the numbers) --- ["0" = default {1️⃣}]
  poll0: "0",
  poll1: "0",
  poll2: "0",
  poll3: "0",
  poll4: "0",
  poll5: "0",
  poll6: "0",
  poll7: "0",
  poll8: "0",
  poll9: "0",
};

function hasAllProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      throw new Error(`Object is missing property: ${key}`);
    }
  }
  return obj;
}

export const config = hasAllProperties(envVariables);
