import { AuditLogEvent } from "discord.js";
import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";

export default new Event("guildBanRemove", async (guildUnban) => {
  try {
    console.log(
      `${guildUnban.user.tag}'s ban was removed from ${guildUnban.user.tag}.`
    );

    if (!config.logChannel) return;

    const unbanLog = await getTextChannelFromID(
      guildUnban.guild,
      config.logChannel
    );

    if (!unbanLog) {
      return console.error("Cannot find Log Channel.");
    }

    const fetchedLogs = await guildUnban.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove,
    });

    const unbanAuditLog = fetchedLogs.entries.first();

    if (!unbanAuditLog) {
      `Cannot find audit log entry for ${guildUnban.user.tag}.`;
    }

    const { executor, target, action } = unbanAuditLog;

    if (!executor || !target || action !== AuditLogEvent.MemberBanRemove) {
      return console.error(
        "Cannot find executor or target from the Audit Log."
      );
    }
    const executingMember = await guildUnban.guild.members.fetch(executor.id);

    if (!target.id === guildUnban.user.id) {
      return console.error(
        "The IDs of the target in the AuditLog and the target from the Event did not match."
      );
    }

    const unbanEmbed = new kickBanEmbedBuilder(
      guildUnban.user,
      executingMember,
      "unban",
      guildUnban.reason
    );

    unbanLog.send({ embeds: [unbanEmbed] });
  } catch (err) {
    console.error(
      `Something went wrong trying to log the unban for ${guildUnban.user.tag}: ${err}`
    );
  }
});
