import { EmbedBuilder } from "discord.js";

export class EmbbColour extends EmbedBuilder {
  constructor(user, data) {
    super(data);

    this.setColor(0xff3700);

    // this.setFooter({
    //   text: `Requested by ${user.username}`,
    //   iconURL: user.displayAvatarURL(),
    // });

    // this.setTimestamp(Date.now());
  }
}
