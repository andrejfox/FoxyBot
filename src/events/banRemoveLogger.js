import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";
import { config } from "../config/config.js";
import { AuditLogEvent } from "discord.js";
import { Event } from "djs-handlers";

export default new Event("guildBanRemove", async (guildUnban) => {
  const unban = guildUnban.partial ? await guildUnban.fetch() : guildUnban;

  console.log(`${unban.user.tag}'s ban was removed from ${unban.guild}.`);

  if (!config.logChannel) return;

  const unbanLog = await getTextChannelFromID(
    guildUnban.guild,
    config.logChannel
  );

  const fetchedLogs = await unban.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanRemove,
  });

  const unbanAuditLog = fetchedLogs.entries.first();

  if (!unbanAuditLog) {
    throw new Error("Cannot find BanLog.");
  }

  const { executor, target, action, reason } = unbanAuditLog;

  if (!executor || !target || action !== AuditLogEvent.MemberBanRemove) {
    throw new Error("Cannot find executor or target from the Audit Log.");
  }

  const executingMember = await unban.guild.members.fetch(executor.id);

  if (target.id === unban.user.id) {
    const unbanEmbed = new kickBanEmbedBuilder(
      unban.user,
      executingMember,
      "unban",
      reason
    );

    unbanLog.send({ embeds: [unbanEmbed] });
  } else {
    throw new Error(
      "The IDs of the target in the AuditLog and the target from the Event did not match."
    );
  }
});
