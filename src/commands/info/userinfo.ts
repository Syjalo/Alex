import { ApplicationCommandOptionType, Colors, UnsafeEmbed as Embed, User } from 'discord.js';
import { Command } from '../../types';
import { Util } from '../../util/Util';

const command: Command = {
  name: 'userinfo',
  description: 'Gives information about user',
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'user',
      description: 'User to give information about',
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'id',
      description: 'Id of user to give information about',
    },
  ],
  async listener(interaction, client, getString) {
    let user: User,
      member = interaction.options.getMember('user'),
      id = interaction.options.getString('id');

    if (member) user = await member.user.fetch();
    else if (id) {
      user = await client.users.fetch(id).catch(() => {
        throw 'userNotFound';
      });
      member = interaction.guild!.members.resolve(id);
    } else {
      user = await interaction.user.fetch();
      member = interaction.member;
    }

    const embed = new Embed()
      .setAuthor({ name: member?.displayName ?? user.username, url: Util.makeUserURL(user.id) })
      .setDescription(`${user} \`${user.tag}\` (${user.id})`)
      .setThumbnail(member?.displayAvatarURL({ size: 4096 }) ?? user.displayAvatarURL({ size: 4096 }))
      .setColor(member?.displayColor || Colors.LightGrey);

    if (member) {
      let emoji: string,
        statusName = member?.presence?.status;
      switch (member?.presence?.status) {
        case 'online':
          emoji = '<:online:948828497550409738>';
          break;
        case 'idle':
          emoji = '<:idle:948828495474229278>';
          break;
        case 'dnd':
          emoji = '<:dnd:948828496841551892>';
          break;
        default:
          emoji = '<:offline:948828496027869194>';
          statusName = 'offline';
          break;
      }
      const platforms = member?.presence?.clientStatus ? Object.keys(member?.presence?.clientStatus) : [];
      const status = `${emoji} ${getString(`embed.field.status.values.status.${statusName}`)} ${(() =>
        platforms.length
          ? `(${platforms.map((platform) => getString(`embed.field.status.values.platform.${platform}`)).join(', ')})`
          : '')()}`;

      embed.addField({ name: getString('embed.field.status.name'), value: status });
    }
    embed.addField({
      name: getString('embed.field.createdAccount.name'),
      value: Util.makeFormattedTime(Math.floor(user.createdTimestamp / 1000)),
    });
    if (member?.joinedTimestamp)
      embed.addField({
        name: getString('embed.field.joinedServer.name'),
        value: Util.makeFormattedTime(Math.floor(member.joinedTimestamp / 1000)),
      });
    if (member?.premiumSinceTimestamp)
      embed.addField({
        name: getString('embed.field.serverBooster.name'),
        value: Util.makeFormattedTime(Math.floor(member.premiumSinceTimestamp / 1000)),
      });
    const roles = member?.roles.cache
      .filter((role) => role.id !== member!.guild.id)
      .sort((role1, role2) => role2.rawPosition - role1.rawPosition)
      .map((role) => `${role}`);
    if (roles?.length)
      embed.addField({
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
        status += custom.state;
        activitiesFieldValue += `**${getString('embed.field.activity.values.custom.name')}**\n${status}\n`;
      }

      const spotify = activities.find((a) => a.id === 'spotify:1');
      if (spotify) {
        const res = await client.spotify.tracks.get(spotify.syncId!);
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

      embed.addField({ name: 'Activity', value: activitiesFieldValue });
    }
    if (user.banner) embed.setImage(user.bannerURL({ size: 4096 })!);

    interaction.reply({ embeds: [embed] });
  },
};

export default command;
