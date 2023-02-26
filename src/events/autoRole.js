import { config } from "../config/config.js";
import { Event } from "djs-handlers";

export default new Event("guildMemberAdd", (member) => {
  if (!config.autoJoinRole) return;

  const autorole = member.guild.roles.cache.get(config.autoJoinRole);

  if (!autorole) {
    return console.log(`Auto role not found: ${config.autoJoinRole}.`);
  }

  try {
    member.roles.add(config.autoJoinRole);

    console.log(
      `Automatically assigned role ${autorole.name} to ${member.user.username}.`
    );
  } catch (err) {
    console.error(err);
  }
});
