import { EmbedBuilder } from "discord.js";
import { config } from "../config/config.js";

export class EmbbColourFootter extends EmbedBuilder {
  constructor(user, data) {
    super(data);

    this.setColor(config.mainEmbedColour);

    this.setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    });

    this.setTimestamp(Date.now());
  }
}
