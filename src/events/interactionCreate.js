import { Event } from 'djs-handlers';
import { client } from '../index.js';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  const getChannelName = (channel) => {
    if (channel && 'name' in channel) {
      return channel.name;
    }
  };

  const channelNameAddon = `in #${getChannelName(interaction.channel)}` || '';

  console.log(
    `${interaction.user.tag} ${channelNameAddon} triggered an interaction.`,
  );

  if (!command) {
    return interaction.reply({
      content: `This interaction does not exist!`,
      ephemeral: true,
    });
  }

  try {
    return command.execute({
      args: interaction.options,
      client,
      interaction: interaction,
    });
  } catch (err) {
    return interaction.reply({
      content: 'There was an error trying to execute this command!',
      ephemeral: true,
    });
  }
});
