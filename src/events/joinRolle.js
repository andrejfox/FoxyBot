import { config } from "../config/config.js";
import { Event } from "djs-handlers";

export default new Event("guildMemberAdd", (member) => {
  console.log(`${member} has joined!`);
  if (config.joinRolle !== "0") {
    console.log(`Added role: ${config.joinRolle}.`);
    member.roles.add(config.joinRolle);
  }
});
