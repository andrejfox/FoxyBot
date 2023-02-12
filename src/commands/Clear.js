import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "djs-handlers";

export default new Command({
  name: "clear",
  description: "Deletes messages from a text channel.",
  options: [
    {
      name: "amount",
      description:
        "The number of messages the bot should delete. Default is 1.",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  execute: async ({ interaction, args }) => {
    let count = args.getInteger("amount") ?? 1;

    if (count > 100 || count <= 0) {
      interaction.reply({
        content: "You can only delete between 1 and 100 messages at a time.",
        ephemeral: true,
      });
    }

    await interaction.channel
      .bulkDelete(count)
      .then(() => {
        interaction.reply({
          content: `Successfully deleted ${count} messages!`,
        });

        setTimeout(async () => {
          const messages = await interaction.channel.messages.fetch({
            limit: 1,
          });
          messages.forEach((messages) => messages.delete());
        }, 1500);
      })
      .catch((err) => {
        if (
          err.rawError.message ===
          "You can only bulk delete messages that are under 14 days old."
        ) {
          interaction.reply(err.rawError.message);
        } else {
          console.error(err);
          interaction.reply({
            content: "An error occurred while trying to delete messages.",
            ephemeral: true,
          });
        }
      });
  },
});
