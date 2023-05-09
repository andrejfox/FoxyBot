import { AuditLogEvent } from "discord.js";
import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { kickBanEmbedBuilder } from "../struct/kickBanUnbanEmbedBuilder.js";
import { getTextChannelFromID } from "../util/helpers.js";

export default new Event("guildBanAdd", async (guildBan) => {
  try {
    const guildName = guildBan.guild.name;
    console.log(
      `${guildBan.user.tag} was banned from${" " + guildName ?? ""}!`
    );

    if (!config.guildTraficLog) return;

    const logChannel = await getTextChannelFromID(
      guildBan.guild,
      config.guildTraficLog
    );
    if (!logChannel) return console.log("Cannot find Log Channel.");

    const fetchedLogs = await guildBan.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd,
    });

    const { executor, target, action, reason } = fetchedLogs.entries.first();

    if (!executor || !target || action !== AuditLogEvent.MemberBanAdd) {
      throw new Error(
        "Cannot find executor or target or action from the Audit Log. [Ban]"
      );
    }

    if (target.id !== guildBan.user.id) {
      return console.error(
        "The IDs of the target in the AuditLog and the target from the Event did not match."
      );
    }

    const executingMember = await guildBan.guild.members.fetch(executor.id);

    const banEmbed = new kickBanEmbedBuilder(
      guildBan.user,
      executingMember,
      "Ban",
      reason
    );
    banEmbed.setColor(0x750999);

    logChannel.send({ embeds: [banEmbed] });
  } catch (err) {
    console.error(
      `Something went wrong trying to log the ban for ${guildBan.user.tag}: ${err}`
    );
  }
});
