import { EmbedBuilder } from "discord.js";
import { config } from "../config/config.js";

export class JoinLeaveEmbedBuilder extends EmbedBuilder {
  constructor(member, action, data) {
    super(data);

    this.setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL(),
    });

    this.setFooter({
      text: `${action}`,
    });

    this.setColor(config.mainEmbedColour);

    this.setTimestamp(Date.now());
  }
}
