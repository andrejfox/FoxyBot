import { EmbedBuilder } from "discord.js";

export class JoinLeaveEmbedBuilder extends EmbedBuilder {
  constructor(member, action, data) {
    super(data);

    this.setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL(),
    });

    this.setFooter({ text: `${action}` });

    this.setTimestamp(Date.now());
  }
}
