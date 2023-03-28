import { AuditLogEvent, inlineCode, time } from "discord.js";
import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { JoinLeaveEmbedBuilder } from "../struct/JoinLeaveEmbedBuilder.js";
import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { getTextChannelFromID, getJoinedAtComponent } from "../util/helpers.js";

export default new Event("guildMemberRemove", async (member) => {
  console.log(member);
  try {
    const joinedAt = getJoinedAtComponent(member);

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
    });

    const kickLog = fetchedLogs.entries.first();

    const { target } = kickLog;

    if (target.id === member.user.id) {
      const { executor, target, action, reason } = kickLog;
      if (!executor || !target || action !== AuditLogEvent.MemberKick) {
        return console.error(
          "Cannot find executor or target from the Audit Log."
        );
      }

      console.log(`${member.user.tag} was kicked from ${member.guild.name}.`);

      if (!config.logChannel) return;

      const memberLog = await getTextChannelFromID(
        member.guild,
        config.logChannel
      );

      const executingMember = await member.guild.members.fetch(executor.id);

      const embed = new kickBanEmbedBuilder(
        member.user,
        executingMember,
        "Kick",
        reason
      );

      embed.setColor(0xc90000);

      await memberLog.send({ embeds: [embed] });
    } else {
      if (!config.logChannel) return;

      const memberLog = await getTextChannelFromID(
        member.guild,
        config.logChannel
      );

      if (!memberLog) {
        return console.error("Cannot find Log Channel.");
      }

      console.log(`${member.user.tag} has left ${member.guild.name}!`);

      const embed = new JoinLeaveEmbedBuilder(member, "Left", {
        description: `**User ID:** ${inlineCode(
          member.user.id
        )}${joinedAt}\n**Left at:** ${time(new Date(), "f")} (${time(
          new Date(),
          "R"
        )})`,
      });

      embed.setColor(0xdbbc0b);

      await memberLog.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error(
      `Something went wrong trying to log a user leaving or being kicked: ${err}`
    );
  }
});
