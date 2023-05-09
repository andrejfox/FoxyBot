import { Event } from "djs-handlers";
import { config } from "../config/config.js";

export default new Event("guildMemberAdd", (member) => {
  try {
    if (!config.autoJoinRole) return;

    const autorole = member.guild.roles.cache.get(config.autoJoinRole);

    if (!autorole) {
      return console.log(`Auto role not found: ${config.autoJoinRole}.`);
    }

    member.roles.add(autorole);

    console.log(
      `Automatically assigned role ${autorole.name} to ${member.user.username}.`
    );
  } catch (err) {
    console.error(
      `Something went wrong trying to assign the auto role: ${err}`
    );
  }
});
