import { UnsafeEmbed as Embed } from '@discordjs/builders';
import {
  ApplicationCommandOptionType,
  Colors,
  GuildBasedChannel,
  GuildTextBasedChannel,
  TextChannel,
} from 'discord.js';
import { Command } from '../../types';
import { ids } from '../../util/Constants';

const command: Command = {
  name: 'say',
  description: 'Sends message',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'content',
      description: 'Message to send',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'reply',
      description: 'Message id to reply to',
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      name: 'mention',
      description: 'Whether the author of the message being replied to should be pinged. Default: True',
    },
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'Channel to send message in',
    },
  ],
  allowedRoles: [ids.roles.developer, ids.roles.managment, ids.roles.moderators],
  listener(interaction, client, getString) {
    const content = interaction.options.getString('content', true),
      reply = interaction.options.getString('reply');
    let mention = interaction.options.getBoolean('mention'),
      channel = interaction.options.getChannel('channel') as GuildBasedChannel;

    if (mention === null) mention = true;
    channel ??= interaction.channel as GuildTextBasedChannel;
    if (!channel.isText()) throw 'notTextChannel';

    const logEmbed = new Embed()
      .setTitle('Say command was used')
      .setDescription(`${interaction.user} used the command`)
      .setFields(
        {
          name: 'Channel',
          value: `${channel}`,
        },
        {
          name: 'Content',
          value: content,
        },
      )
      .setColor(Colors.LightGrey);
    (client.channels.resolve(ids.channels.botLog)! as TextChannel).send({ embeds: [logEmbed] });

    channel.send({ content, allowedMentions: { repliedUser: mention }, reply: { messageReference: reply! } });
    interaction.reply({ content: getString('sent', { variables: { channel: `${channel}` } }), ephemeral: true });
  },
};

export default command;
