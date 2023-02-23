import { EmbedBuilder, inlineCode, time } from "discord.js";
import { config } from "../config/config.js";

export class kickBanEmbedBuilder extends EmbedBuilder {
  constructor(target, executor, action, reason, expiration) {
    super();

    let actionPast = action;

    switch (actionPast) {
      case "kick":
        actionPast = "Kicked";
        break;
      case "ban":
        actionPast = "Banned";
        break;
      case "unban":
        actionPast = "Unbanned";
        break;
    }

    let descriptionObject = {
      targetId: `**Target ID:** ${inlineCode(target.id)}`,
      actionMadeAt: `**${actionPast} on:** ${time(
        Math.floor(Date.now() / 1000),
        "f"
      )} (${time(Math.floor(Date.now() / 1000), "R")})`,
      action: `**Action:** ${action}`,
      executor: `**Executor:** ${executor.user.tag}`,
      reason: undefined,
      expiration: undefined,
    };

    if (reason) {
      descriptionObject.reason = `**Reason:** ${reason}`;
    }

    if (expiration) {
      descriptionObject.expiration = `**Expiration:** ${expiration}`;
    }

    const description = Object.values(descriptionObject).join("\n");

    let color;

    switch (action) {
      case "kick":
        color = 0xc70404; //red
        break;
      case "ban":
        color = 0x6d0699; //purple
        break;
      case "unban":
        color = 0xb30b75; //pink
        break;

      default:
        color = config.mainEmbedColour; //black
    }

    this.setColor(color);

    this.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });

    this.setDescription(description);

    this.setFooter({
      text: `${actionPast} by ${executor.user.username}`,
      iconURL: executor.user.displayAvatarURL(),
    });

    this.setTimestamp(Date.now());
  }
}
