import { config } from "../config/config.js";
import { Event } from "djs-handlers";

export default new Event("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`);

  if (!config.activityStatus[0] && config.activityStatus[0] !== 0) {
    return;
  }

  if (
    config.activityStatus[0] > 5 ||
    config.activityStatus[0] < 0 ||
    config.activityStatus[0] === 4 ||
    typeof config.activityStatus[0] !== "number" ||
    typeof config.activityStatus[1] !== "string"
  ) {
    return console.log("Invalid activity status!");
  }

  client.user.setActivity(config.activityStatus[1], {
    type: config.activityStatus[0],
  });
  console.log(
    `Set the activity status to: Type[${config.activityStatus[0]}] | Content[${config.activityStatus[1]}]`
  );
});
