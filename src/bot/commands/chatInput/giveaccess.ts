import { Formatters, OverwriteType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { AlexBotChatInputCommand } from '../../types';
import { Ids, PrivateChannels } from '../../util/Constants';
import { Util } from '../../util/Util';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('giveaccess')
    .setDescription('Gives access to a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName('channel').setDescription('Channel to give access to').setAutocomplete(true).setRequired(true),
    ),
  listener: (interaction) => {
    if (!interaction.member.roles.cache.has(Ids.roles.managment)) return;

    const query = interaction.options.getString('channel', true);
    const channel = Util.channelsToGiveAccess(interaction.guild.channels.cache, query, interaction.member)[0];
    if (!channel || channel.isThread() || PrivateChannels.includes(channel.id)) {
      interaction.reply({
        content: `I can't find the channel by your query: ${Formatters.inlineCode(query)}`,
        ephemeral: true,
      });
      return;
    }

    channel.permissionOverwrites.create(
      Ids.roles.managment,
      { ManageChannels: true, ViewChannel: true },
      { type: OverwriteType.Role },
    );
    interaction.reply({ content: `I gave you access to ${channel}`, ephemeral: true });
  },
};
