import dotenv from "dotenv";

dotenv.config();

const envVariables = {
  botToken: process.env.BOT_TOKEN,
  clientID: process.env.CLIENT_ID,
  guildID: process.env.GUILD_ID,
  instantRolle: "1068940588470259803", //<- add instant role id (just the numbers) | 0 will set instant rolle off
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
