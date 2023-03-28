import { EmbedBuilder, inlineCode, time } from "discord.js";
import { config } from "../config/config.js";

export class kickBanEmbedBuilder extends EmbedBuilder {
  constructor(target, executor, action, reason, expiration) {
    super();

    let actionPast;

    switch (action) {
      case "Kick":
        actionPast = "Kicked";
        break;
      case "Ban":
        actionPast = "Banned";
        break;
      case "Unban":
        actionPast = "Unbanned";
        break;
    }

    let descriptionObject = {
      targetId: `**Target ID:** ${inlineCode(target.id)}`,
      actionMadeAt: `**${actionPast} on:** ${time(
        Math.floor(Date.now() / 1000),
        "f"
      )} (${time(Math.floor(Date.now() / 1000), "R")})`,
      executor: `**Executor:** ${executor.user.tag}`,
      reason: undefined,
      expiration: undefined,
    };

    if (reason) descriptionObject.reason = `**Reason:** ${reason}`;

    if (expiration)
      descriptionObject.expiration = `**Expiration:** ${expiration}`;

    const description = Object.values(descriptionObject).join("\n");

    this.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });

    this.setDescription(description);

    this.setFooter({
      text: action,
      iconURL: executor.user.displayAvatarURL(),
    });

    this.setTimestamp(Date.now());
  }
}
