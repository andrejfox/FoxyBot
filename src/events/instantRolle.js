import { config } from "../config/config.js";
import { Event } from "djs-handlers";

export default new Event("guildMemberAdd", (member) => {
  console.log(`${member} has joined!`);
  if (config.instantRolle != "0") {
    console.log(`Added role: ${config.instantRolle}.`);
    member.roles.add(config.instantRolle);
  }
});
