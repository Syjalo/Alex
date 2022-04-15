import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, Colors, PermissionFlagsBits, TextChannel, UnsafeEmbedBuilder as Embed } from 'discord.js';
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
  listener: async (interaction, client, getString) => {
    const content = interaction.options.getString('content', true),
      replyMessageId = interaction.options.getString('reply'),
      mention = interaction.options.getBoolean('mention'),
      repliedUser = mention === null ? true : mention,
      channel = (interaction.options.getChannel('channel') as TextChannel) || interaction.channel!;

    if (!channel.permissionsFor(interaction.user)?.has(PermissionFlagsBits.SendMessages)) {
      interaction.reply({
        content: getString('notAllowed', { variables: { channel: `${channel}` } }),
        ephemeral: true,
      });
      return;
    }

    const message = await channel.send({
      content,
      allowedMentions: { parse: ['roles', 'users'], repliedUser },
      reply: { messageReference: replyMessageId! },
    });

    await interaction.reply({ content: getString('sent', { variables: { channel: `${channel}` } }), ephemeral: true });

    const embed = new Embed()
      .setTitle('Say command was used')
      .setDescription(`${interaction.user} used the command\n\n[Jump](${message.url})`)
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
    await ((await client.channels.fetch(Ids.channels.botLog)) as TextChannel).send({ embeds: [embed] });
  },
};
