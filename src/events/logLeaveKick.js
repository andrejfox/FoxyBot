import fs from "fs";
import { __dirname } from "../util/path.js";
import { Event } from "djs-handlers";
import { AuditLogEvent, time, inlineCode } from "discord.js";
import { config } from "../config/config.js";
import { JoinLeaveEmbedBuilder } from "../struct/JoinLeaveEmbedBuilder.js";
import { kickBanEmbedBuilder } from "../struct/kickBanUnbanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";

export default new Event("guildMemberRemove", async (member) => {
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberKick,
  });

  const CurrentKickID = fetchedLogs.entries.keys().next().value;
  if (!CurrentKickID) {
    return console.error(
      `Cannot find audit log kick ID for ${member.user.tag}.`
    );
  }

  const data = fs.readFileSync(
    path.join(__dirname, "logKickMemoryID.json"),
    "utf-8"
  );
  const obj = JSON.parse(data);
  const { lastKickID } = obj;

  const { target } = fetchedLogs.entries.first();

  if (target.id === member.user.id && CurrentKickID !== lastKickID) {
    try {
      const guildName = member.guild.name;
      console.log(
        `${member.user.tag} was kicked from${" " + guildName ?? ""}!`
      );

      if (!config.guildTraficLog) return;

      const logChannel = await getTextChannelFromID(
        member.guild,
        config.guildTraficLog
      );
      if (!logChannel) return console.log("Cannot find Log Channel.");

      const { executor, target, action, reason } = fetchedLogs.entries.first();

      if (!executor || !target || action !== AuditLogEvent.MemberKick) {
        return console.error(
          "Cannot find executor or target from the Audit Log. [Kick]"
        );
      }

      if (target.id !== member.user.id) {
        return console.error("Cannot find target from the Audit Log. [Kick]");
      }

      const executingMember = await member.guild.members.fetch(executor.id);

      const kickEmbed = new kickBanEmbedBuilder(
        member.user,
        executingMember,
        "Kick",
        reason
      );
      kickEmbed.setColor(0xc90000);

      await logChannel.send({ embeds: [kickEmbed] });

      obj.lastKickID = fetchedLogs.entries.keys().next().value;
      const newData = JSON.stringify(obj);
      fs.writeFileSync(path.join(__dirname, "logKickMemoryID.json"), newData);
      return;
    } catch (err) {
      console.error(
        `Something went wrong trying to log a user beeing kicked: ${err}`
      );
    }
  }
  try {
    const guildName = member.guild.name;
    console.log(`${member.user.tag} has left${" " + guildName ?? ""}!`);

    if (!config.guildTraficLog) return;

    const logChannel = await getTextChannelFromID(
      member.guild,
      config.guildTraficLog
    );
    if (!logChannel) return console.log("Cannot find Log Channel.");

    const leaveEmbed = new JoinLeaveEmbedBuilder(member, "Leave", {
      description: `**User ID:** ${inlineCode(member.user.id)}
    **Left on:** ${time(Math.floor(Date.now() / 1000), "f")} (${time(
        Math.floor(Date.now() / 1000),
        "R"
      )})
    **Created on:** ${time(member.user.createdAt, "f")} (${time(
        member.user.createdAt,
        "R"
      )})`,
    });
    leaveEmbed.setColor(0xdbbc0b);

    logChannel.send({ embeds: [leaveEmbed] });
  } catch (err) {
    console.error(`Something went wrong trying to log a user leaving: ${err}`);
  }
});
