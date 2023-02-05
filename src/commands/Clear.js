import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "djs-handlers";
import { EmbbColour } from "../struct/EmbbColour.js";

export default new Command({
  name: "clear",
  description: "Delites some messages",
  userPermissions: "Administrator",
  options: [
    {
      name: "amount",
      description: "The number of messages the bot should delite.",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  execute: async ({ interaction, args }) => {
    try {
      const delNum = args.getInteger("amount");

      if (delNum > 100) {
        interaction.reply({
          embeds: [
            new EmbbColour(interaction.user, {
              title: "The maximum amount of messages you can delite is 100!",
            }),
          ],
        });
      }

      switch (delNum) {
        case 0:
          interaction.reply({
            embeds: [
              new EmbbColour(interaction.user, {
                title: "The minimum amount of messages you can delite is 1!",
              }),
            ],
          });
          break;

        case null:
          const messages1 = await interaction.channel.messages.fetch({
            limit: 1,
          });

          messages1.forEach((messages) => messages.delete());

          interaction.reply({
            embeds: [
              new EmbbColour(interaction.user, {
                title: `Deleted 1 message.`,
              }),
            ],
          });
          break;

        default:
          const messages2 = await interaction.channel.messages.fetch({
            limit: delNum,
          });

          messages2.forEach((messages) => messages.delete());

          interaction.reply({
            embeds: [
              new EmbbColour(interaction.user, {
                title: `Delited ${delNum} messages.`,
              }),
            ],
          });
      }
      //         setTimeout(async () => {
      //           const messages = await interaction.channel.messages.fetch({
      //             limit: 1,
      //           });
      //           messages.forEach((messages) => messages.delete());
      //         }, 4000);
    } catch (err) {
      console.error(err);
    }
  },
});
