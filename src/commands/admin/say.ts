import { GuildChannel, TextChannel } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { Command } from '../../types';
import { Ids } from '../../util/Constants';

const command: Command = {
  name: 'say',
  description: 'Sends message',
  options: [
    {
      type: 'STRING',
      name: 'content',
      description: 'Message to send',
      required: true,
    },
    {
      type: 'CHANNEL',
      name: 'channel',
      description: 'Channel to send message in',
    },
  ],
  allowedRoles: [Ids.roles.communityManager],
  listener(interaction, client, getString) {
    const content = interaction.options.getString('content', true);
    let channel = interaction.options.getChannel('channel') as GuildChannel;

    channel ??= interaction.channel as TextChannel;
    if (!channel.isText()) throw 'notTextChannel';

    channel.send(content);
    interaction.reply({ content: getString('sent', { variables: { channel: `${channel}` } }), ephemeral: true });
  },
};

export default command;
