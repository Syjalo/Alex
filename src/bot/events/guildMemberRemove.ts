import { Colors, EmbedBuilder as Embed, Formatters, TextChannel } from 'discord.js';
import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { Util } from '../util/Util';

export const event: AlexBotClientEvent<'guildMemberRemove'> = {
  name: 'guildMemberRemove',
  listener: async (client, member) => {
    const embed = new Embed()
      .setAuthor({
        iconURL: member.displayAvatarURL({ extension: 'png' }),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle('Goodbye!')
      .setDescription(`${member} ${Formatters.inlineCode(member.user.tag)} (${member.id})`)
      .setFields(
        {
          name: 'Created the account',
          value: Util.makeFormattedTime(Math.floor(member.user.createdTimestamp / 1000)),
        },
        {
          name: 'Left the server',
          value: Util.makeFormattedTime(Math.floor(Date.now() / 1000)),
        },
      )
      .setColor(Colors.LightGrey);

    const dbGuild = await database.guilds.findOne({ id: member.guild.id });

    await (client.channels.resolve(dbGuild!.channelIds.joinLeave) as TextChannel).send({ embeds: [embed] });
  },
};
