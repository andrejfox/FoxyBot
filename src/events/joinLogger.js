import { Event } from "djs-handlers";
import { config } from "../config/config.js";
import { userMention, inlineCode, time } from "discord.js";
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

  const joinLeaveEmbed = new JoinLeaveEmbedBuilder(member, "joined", {
    description: `Username: ${userMention(
      member.user.id
    )}\nUser ID: ${inlineCode(member.user.id)}${joinedAt}\nCreated at: ${time(
      member.user.createdAt,
      "f"
    )} (${time(member.user.createdAt, "R")})`,
  });

  memberLog.send({ embeds: [joinLeaveEmbed] });
});
