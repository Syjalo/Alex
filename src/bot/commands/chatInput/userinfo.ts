import { SlashCommandBuilder } from '@discordjs/builders';
import { Colors, Formatters, UnsafeEmbed as Embed } from 'discord.js';
import { spotify } from '../../../spotify';
import { AlexBotChatInputCommand } from '../../types';
import { Emojis } from '../../util/Constants';
import { Util } from '../../util/Util';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Gives information about user')
    .addUserOption((option) => option.setName('user').setDescription('User to give information about'))
    .addStringOption((option) => option.setName('id').setDescription('Id of user to give information about')),
  listener: async (interaction, client, getString) => {
    await interaction.deferReply();

    let user = interaction.options.getUser('user');
    const id = interaction.options.getString('id');

    if (!(user || id)) user = interaction.user;
    if (!user && id) user = await client.users.fetch(id).catch(() => null);
    if (!user) throw 'userNotFound';
    const member = await interaction.guild.members.fetch(user).catch(() => null);

    const embed = new Embed()
      .setAuthor({ name: member?.displayName || user.username, url: Util.makeUserURL(user.id) })
      .setDescription(`${user}${user.bot ? ` ${Emojis.bot}` : ''} ${Formatters.inlineCode(user.tag)} (${user.id})`)
      .setThumbnail(member?.displayAvatarURL({ size: 4096 }) || user.displayAvatarURL({ size: 4096 }))
      .setColor(member?.displayColor || Colors.LightGrey);

    if (member) {
      let emoji: string,
        statusName = member?.presence?.status;
      switch (member?.presence?.status) {
        case 'online':
          emoji = Emojis.online;
          break;
        case 'idle':
          emoji = Emojis.idle;
          break;
        case 'dnd':
          emoji = Emojis.dnd;
          break;
        default:
          emoji = Emojis.offline;
          statusName = 'offline';
          break;
      }
      const platforms = member?.presence?.clientStatus ? Object.keys(member?.presence?.clientStatus) : [];
      const status = `${emoji} ${getString(`embed.field.status.values.status.${statusName}`)} ${(() =>
        platforms.length
          ? `(${platforms.map((platform) => getString(`embed.field.status.values.platform.${platform}`)).join(', ')})`
          : '')()}`;

      embed.addFields({ name: getString('embed.field.status.name'), value: status });
    }
    embed.addFields({
      name: getString('embed.field.createdAccount.name'),
      value: Util.makeFormattedTime(Math.floor(user.createdTimestamp / 1000)),
    });
    if (member?.joinedTimestamp)
      embed.addFields({
        name: getString('embed.field.joinedServer.name'),
        value: Util.makeFormattedTime(Math.floor(member.joinedTimestamp / 1000)),
      });
    if (member?.premiumSinceTimestamp)
      embed.addFields({
        name: getString('embed.field.serverBooster.name'),
        value: Util.makeFormattedTime(Math.floor(member.premiumSinceTimestamp / 1000)),
      });
    const roles = member?.roles.cache
      .filter((role) => role.id !== member!.guild.id)
      .sort((role1, role2) => role2.rawPosition - role1.rawPosition)
      .map((role) => `${role}`);
    if (roles?.length)
      embed.addFields({
        name: getString('embed.field.roles.name', { variables: { count: roles.length } }),
        value: roles.join(', '),
      });
    let activities = member?.presence?.activities;
    if (activities?.length) {
      let activitiesFieldValue = '';

      const custom = activities.find((a) => a.id === 'custom');
      if (custom) {
        let status = '';
        if (custom.emoji) status += `${custom.emoji} `;
        if (custom.state) status += custom.state;
        activitiesFieldValue += `**${getString('embed.field.activity.values.custom.name')}**\n${status}\n`;
      }

      const spotifyActivity = activities.find((a) => a.id === 'spotify:1');
      if (spotifyActivity) {
        const res = await spotify.tracks.get(spotifyActivity.syncId!);
        activitiesFieldValue += `**Spotify**\n${getString('embed.field.activity.values.spotify.value', {
          variables: {
            name: `[${res.name}](${res.external_urls.spotify})`,
            artists: res.artists.map((artist) => `[${artist.name}](${artist.external_urls.spotify})`).join(', '),
            album: `[${res.album.name}](${res.album.external_urls.spotify})`,
            artistsNumber: res.artists.length,
          },
        })}\n`;
      }

      activities = activities.filter((activity) => !['custom', 'spotify:1'].includes(activity.id));
      for (const activity of activities) {
        activitiesFieldValue += `**${activity.name}**\n${(() => {
          if (activity.details) return `${activity.details}\n`;
          return '';
        })()}${(() => {
          if (activity.state) return `${activity.state}\n`;
          return '';
        })()}`;
      }

      embed.addFields({ name: 'Activity', value: activitiesFieldValue });
    }
    if (user.banner) embed.setImage(user.bannerURL({ size: 4096 })!);

    await interaction.editReply({ embeds: [embed] });
  },
};
