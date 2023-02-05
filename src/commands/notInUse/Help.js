import { Command } from "djs-handlers";
import { EmbbColour } from "../struct/EmbbColour.js";

export default new Command({
  name: "help",
  description: "Delites some messages",
  execute: async ({ interaction }) => {
    try {
      interaction.reply({
        embeds: [
          new EmbbColour(interaction.user, {
            title: "**Foxy Commands**",
            description:
              "`/clear <amount>` <- Delites a given `amount` of messages\n`/poll <question>` <- Makes a yes/no poll withs a given `question`",
          }),
        ],
      });
    } catch (err) {
      console.error(err);
    }
  },
});
