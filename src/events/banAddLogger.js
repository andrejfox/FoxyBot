import { AuditLogEvent } from "discord.js";
import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { kickBanEmbedBuilder } from "../struct/kickBanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";

export default new Event("guildBanAdd", async (guildBan) => {
  try {
    console.log(`${guildBan.user.tag} was banned from ${guildBan.guild}.`);

    if (!config.logChannel) return;

    const banLog = await getTextChannelFromID(
      guildBan.guild,
      config.logChannel
    );

    if (!banLog) {
      return console.error("Cannot find Log Channel.");
    }

    const fetchedLogs = await guildBan.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd,
    });

    const banAuditLog = fetchedLogs.entries.first();

    if (!banAuditLog) {
      return console.error(
        `Cannot find audit log entry for ${guildBan.user.tag}.`
      );
    }

    const { executor, target, action } = banAuditLog;

    if (!executor || !target || action !== AuditLogEvent.MemberBanAdd) {
      throw new Error("Cannot find executor or target from the Audit Log.");
    }

    const executingMember = await guildBan.guild.members.fetch(executor.id);

    if (target.id !== guildBan.user.id) {
      return console.error(
        "The IDs of the target in the AuditLog and the target from the Event did not match."
      );
    }

    const banEmbed = new kickBanEmbedBuilder(
      guildBan.user,
      executingMember,
      "ban",
      guildBan.reason
    );

    banLog.send({ embeds: [banEmbed] });
  } catch (err) {
    console.error(
      `Something went wrong trying to log the ban for ${guildBan.user.tag}: ${err}`
    );
  }
});
