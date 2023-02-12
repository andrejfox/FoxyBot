import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "djs-handlers";
import { EmbbColourFootter } from "../struct/EmbbColourFootter.js";
import { config } from "../config/config.js";

export default new Command({
  name: "poll",
  description: "Create a poll.",
  options: [
    {
      name: "question",
      description: "The question to ask.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "type",
      description: "The type of poll to create.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Yes/No",
          value: "yesno",
        },
        {
          name: "Multiple Choice",
          value: "multiplechoice",
        },
      ],
    },
    {
      name: "answers",
      description:
        "The answers to the question. Separate each answer with a comma. Maxiumum of 10 answers.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async ({ interaction, args }) => {
    let question = args.getString("question");
    const answerType = args.getString("type");
    const answers = args.getString("answers");

    if (!question || !answerType) {
      return interaction.reply({
        content: "Please specify a question and an answer type!",
        ephemeral: true,
      });
    }

    question = !question.endsWith("?") ? question + "?" : question;

    if (answerType === "yesno") {
      let yesEmote;
      let noEmote;

      if (config.pollYes === "0") {
        yesEmote = "⭕";
      } else if (config.pollYes != Number) {
        yesEmote = config.pollYes;
      } else {
        yesEmote = interaction.client.emojis.cache.get(config.pollYes);
      }

      if (config.pollNo === "0") {
        noEmote = "❌";
      } else if (config.pollYes != Number) {
        noEmote = config.pollNo;
      } else {
        noEmote = interaction.client.emojis.cache.get(config.pollNo);
      }

      if (!yesEmote || !noEmote) {
        return interaction.reply({
          content: "Cannot find emojis!",
          ephemeral: true,
        });
      } else {
        const pollEmbed = new EmbbColourFootter(interaction.user, {
          title: question,
        });

        const message = await interaction.reply({
          embeds: [pollEmbed],
          fetchReply: true,
        });

        await message.react(yesEmote);
        return message.react(noEmote);
      }
    } else {
      if (!answers) {
        return interaction.reply({
          content: "Please specify answers!",
          ephemeral: true,
        });
      }

      let emojiArr = [
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
      ];

      emojiArr.forEach((emoji, index) => {
        const pollNum = "poll" + index;

        function stringWithOnlyNumbers(str) {
          return /^\d+$/.test(str);
        }

        if (config[pollNum] === "0") {
          return;
        } else if (typeof config[pollNum] !== "string") {
          console.log(
            `poll${index} is not a string! located in /src/config/config.js`
          );
        } else if (stringWithOnlyNumbers(config[pollNum])) {
          return (emojiArr[index] = interaction.client.emojis.cache.get(
            config[pollNum]
          ));
        } else {
          return (emojiArr[index] = config[pollNum]);
        }
      });

      const fields = answers.split(",").map((answer, index) => {
        return {
          name: `${emojiArr[index]}  |  ${answer.trim()}`,
          value: "\u200b",
        };
      });

      if (fields.length > 10) {
        return interaction.reply({
          content: "You can only have 10 answers max!",
          ephemeral: true,
        });
      }

      const pollEmbed = new EmbbColourFootter(interaction.user, {
        title: question,
        fields,
      });

      const message = await interaction.reply({
        embeds: [pollEmbed],
        fetchReply: true,
      });

      for (let i = 0; i < fields.length; i++) {
        const emoji = emojiArr[i];
        if (!emoji) break;
        await message.react(emoji);
      }

      return;
    }
  },
});
