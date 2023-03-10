import { AuditLogEvent, inlineCode, time, userMention } from "discord.js";
import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { JoinLeaveEmbedBuilder } from "../struct/JoinLeaveEmbedBuilder.js";
import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";

export default new Event("guildMemberRemove", async (member) => {
  try {
    console.log(`${member.user.tag} has left ${member.guild.name}!`);

    const joinedAt = member.joinedAt
      ? `\nJoined at: ${time(member.joinedAt, "f")} (${time(
          member.joinedAt,
          "R"
        )})`
      : "\u200b";

    if (config.logChannel) {
      const memberLog = await getTextChannelFromID(
        member.guild,
        config.logChannel
      );

      if (!memberLog) {
        return console.error("Cannot find Log Channel.");
      }

      const embed = new JoinLeaveEmbedBuilder(member, "left", {
        description: `Username: ${userMention(
          member.user.id
        )}\nUser ID: ${inlineCode(member.user.id)}${joinedAt}\nLeft at: ${time(
          new Date(),
          "f"
        )} (${time(new Date(), "R")})`,
        color: 0x106dc9,
      });

      await memberLog.send({ embeds: [embed] });
    }

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    });

    const kickLog = fetchedLogs.entries.first();

    if (!kickLog) return;

    const { executor, target, action, reason } = kickLog;

    if (!executor || !target || action !== AuditLogEvent.MemberKick) {
      return console.error(
        "Cannot find executor or target from the Audit Log."
      );
    }

    const executingMember = await member.guild.members.fetch(executor.id);

    if (target.id !== member.user.id) {
      return console.error(
        "The IDs of the target in the AuditLog and the target from the Event did not match."
      );
    }

    console.log(`${member.user.tag} was kicked from ${member.guild.name}.`);

    if (config.logChannel) {
      const memberLog = await getTextChannelFromID(
        member.guild,
        config.logChannel
      );

      if (!memberLog) {
        return console.error("Cannot find Log Channel.");
      }

      const embed = new kickBanEmbedBuilder(
        member.user,
        executingMember,
        "kick",
        reason
      );

      kickBanEmbedBuilder.setColor(0x106dc9);

      await memberLog.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error(
      `Something went wrong trying to log a user leaving or being kicked: ${err}`
    );
  }
});
