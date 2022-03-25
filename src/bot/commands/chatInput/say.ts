import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, TextChannel } from 'discord.js';
import { AlexBotChatInputCommand } from '../../types';
import { Ids } from '../../util/Constants';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Sends message')
    .setDefaultPermission(false)
    .addStringOption((option) => option.setName('content').setDescription('Message to send').setRequired(true))
    .addStringOption((option) => option.setName('reply').setDescription('Message id to reply to'))
    .addBooleanOption((option) =>
      option
        .setName('mention')
        .setDescription('Whether the author of the message being replied to should be pinged. Default: True'),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel to send message in')
        .addChannelTypes(
          ChannelType.GuildNews,
          ChannelType.GuildNewsThread,
          ChannelType.GuildPrivateThread,
          ChannelType.GuildPublicThread,
          ChannelType.GuildText,
        ),
    ),
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
