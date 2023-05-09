import { AuditLogEvent } from "discord.js";
import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { kickBanEmbedBuilder } from "../struct/kickBanUnbanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";

export default new Event("guildBanRemove", async (guildUnban) => {
  try {
    const guildName = guildUnban.guild.name;
    console.log(
      `${guildUnban.user.tag}'s ban was removed from${" " + guildName ?? ""}!`
    );

    if (!config.guildTraficLog) return;

    const logChannel = await getTextChannelFromID(
      guildUnban.guild,
      config.guildTraficLog
    );
    if (!logChannel) return console.error("Cannot find Log Channel.");

    const fetchedLogs = await guildUnban.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove,
    });

    const { executor, target, action, reason } = fetchedLogs.entries.first();

    if (!executor || !target || action !== AuditLogEvent.MemberBanRemove) {
      return console.error(
        "Cannot find executor or target or action from the Audit Log. [Unban]"
      );
    }

    if (!target.id === guildUnban.user.id) {
      return console.error(
        "The IDs of the target in the AuditLog and the target from the Event did not match."
      );
    }

    const executingMember = await guildUnban.guild.members.fetch(executor.id);

    const unbanEmbed = new kickBanEmbedBuilder(
      guildUnban.user,
      executingMember,
      "Unban",
      reason
    );
    unbanEmbed.setColor(0x00ffb7);

    logChannel.send({ embeds: [unbanEmbed] });
  } catch (err) {
    console.error(
      `Something went wrong trying to log the unban for ${guildUnban.user.tag}: ${err}`
    );
  }
});
