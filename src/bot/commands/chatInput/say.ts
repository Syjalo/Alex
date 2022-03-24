import { ApplicationCommandOptionType, ChannelType, TextChannel } from 'discord.js';
import { AlexBotChatInputApplicationCommandData } from '../../types';
import { Ids } from '../../util/Constants';

export const command: AlexBotChatInputApplicationCommandData = {
  name: 'say',
  description: 'Sends message',
  defaultPermission: false,
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
      channelTypes: [
        ChannelType.GuildNews,
        ChannelType.GuildNewsThread,
        ChannelType.GuildPrivateThread,
        ChannelType.GuildPublicThread,
        ChannelType.GuildText,
      ],
      name: 'channel',
      description: 'Channel to send message in',
    },
  ],
  allowedRoles: [Ids.roles.developer, Ids.roles.managment, Ids.roles.moderators],
  listener: async (interaction) => {
    const content = interaction.options.getString('content', true),
      replyMessageId = interaction.options.getString('reply'),
      mention = interaction.options.getBoolean('mention'),
      repliedUser = mention === null ? true : mention,
      channel = (interaction.options.getChannel('channel') as TextChannel) || interaction.channel!;

    await channel.send({
      content,
      allowedMentions: { parse: ['roles', 'users'], repliedUser },
      reply: { messageReference: replyMessageId! },
    });
  },
};
