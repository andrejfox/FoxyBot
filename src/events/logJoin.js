import { getTextChannelFromID } from "../util/helpers.js";
import { JoinLeaveEmbedBuilder } from "../struct/JoinLeaveEmbedBuilder.js";
import { inlineCode, time } from "discord.js";
import { config } from "../config/config.js";
import { Event } from "djs-handlers";

export default new Event("guildMemberAdd", async (member) => {
  try {
    const guildname = member.guild.name;
    console.log(`${member.user.tag} has joined${" " + guildname ?? ""}!`);

    if (!config.guildTraficLog) return;

    const logChannel = await getTextChannelFromID(
      member.guild,
      config.guildTraficLog
    );
    if (!logChannel) return console.log("Cannot find Log Channel.");

    const joinEmbed = new JoinLeaveEmbedBuilder(member, "Join", {
      description: `**User ID:** ${inlineCode(member.user.id)}
    **Joined:** ${time(member.joinedAt, "R")}
    **Created on:** ${time(member.user.createdAt, "f")} (${time(
        member.user.createdAt,
        "R"
      )})`,
    });
    joinEmbed.setColor(0x1fad0c);

    logChannel.send({ embeds: [joinEmbed] });
  } catch (err) {
    console.error(`Something went wrong trying to log a user joining: ${err}`);
  }
});
