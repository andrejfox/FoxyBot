import { JoinLeaveEmbedBuilder } from "../struct/JoinLeaveEmbedBuilder.js";
import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { inlineCode, time, AuditLogEvent } from "discord.js";
import { getTextChannelFromID } from "../util/helpers.js";
import { config } from "../config/config.js";
import { Event } from "djs-handlers";

export default new Event("guildMemberRemove", async (member) => {
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberKick,
  });

  const kickLog = fetchedLogs.entries.first();

  if (!kickLog) {
    throw new Error("Cannot find kickLog.");
  }

  const { executor, target, action, reason } = kickLog;

  if (!executor || !target || action !== AuditLogEvent.MemberKick) {
    throw new Error("Cannot find executor or target from the Audit Log.");
  }

  const executingMember = await member.guild.members.fetch(executor.id);

  if (target.id === member.user.id) {
    console.log(`${member.user.tag} was kicked from ${member.guild.name}.`);

    if (!config.logChannel) return;

    const leaveKickLog = await getTextChannelFromID(
      member.guild,
      config.logChannel
    );

    const kickEmbed = new kickBanEmbedBuilder(
      member.user,
      executingMember,
      "kick",
      reason
    );

    leaveKickLog.send({ embeds: [kickEmbed] });
  } else {
    const guildname = member.guild.name;
    console.log(`${member.user.tag} has left${" " + guildname ?? ""}!`);

    if (!config.logChannel) return;

    const leaveKickLog = await getTextChannelFromID(
      member.guild,
      config.logChannel
    );

    const joinLeaveEmbed = new JoinLeaveEmbedBuilder(member, "left", {
      description: `**User ID:** ${inlineCode(member.user.id)}
      **Left at:** ${time(Math.floor(Date.now() / 1000), "f")} (${time(
        Math.floor(Date.now() / 1000),
        "R"
      )})
      **Created at:** ${time(member.user.createdAt, "f")} (${time(
        member.user.createdAt,
        "R"
      )})`,
    });
    joinLeaveEmbed.setColor(0x106dc9);

    leaveKickLog.send({ embeds: [joinLeaveEmbed] });
  }
});
