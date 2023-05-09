import { EmbedBuilder, inlineCode, time } from "discord.js";

export class kickBanEmbedBuilder extends EmbedBuilder {
  constructor(target, executor, action, reason, expiration) {
    super();

    let descriptionObject = {
      targetId: `**Target ID:** ${inlineCode(target.id)}`,
      actionMadeAt: `**${action} on:** ${time(
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
    });

    this.setTimestamp(Date.now());
  }
}
