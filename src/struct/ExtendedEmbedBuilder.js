import { EmbedBuilder } from "discord.js";

export class ExtendedEmbedBuilder extends EmbedBuilder {
  constructor(user, data) {
    super(data);

    this.setColor(0x000000);

    this.setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    });

    this.setTimestamp(Date.now());
  }
}
