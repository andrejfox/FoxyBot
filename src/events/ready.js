import { Event } from "djs-handlers";
import { ActivityType } from "discord.js";

export default new Event("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("your mom", {
    type: ActivityType.Watching,
  });
});
