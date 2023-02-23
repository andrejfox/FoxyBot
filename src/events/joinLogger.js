import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { inlineCode, time } from "discord.js";
import { JoinLeaveEmbedBuilder } from "../struct/JoinLeaveEmbedBuilder.js";
import { getTextChannelFromID, getJoinedAtComponent } from "../util/helpers.js";

export default new Event("guildMemberAdd", async (member) => {
  const guildname = member.guild.name;
  console.log(`${member.user.tag} has joined${" " + guildname ?? ""}!`);

  if (!config.joinLeaveLog) {
    return;
  }

  const memberLog = await getTextChannelFromID(
    member.guild,
    config.joinLeaveLog
  );

  const joinedAt = getJoinedAtComponent(member);

  const joinLeaveEmbed = new JoinLeaveEmbedBuilder(member, "Joined", {
    description: `**User ID:** ${inlineCode(
      member.user.id
    )}${joinedAt}\n**Created on:** ${time(member.user.createdAt, "f")} (${time(
      member.user.createdAt,
      "R"
    )})`,
  });
  joinLeaveEmbed.setColor(0x1fad0c);

  memberLog.send({ embeds: [joinLeaveEmbed] });
});
