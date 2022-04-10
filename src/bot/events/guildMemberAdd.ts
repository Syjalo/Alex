import { ColorResolvable, Colors, EmbedBuilder as Embed, Formatters, TextChannel } from 'discord.js';
import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { Util } from '../util/Util';

export const event: AlexBotClientEvent<'guildMemberAdd'> = {
  name: 'guildMemberAdd',
  listener: async (client, member) => {
    const userCreatedAccountAgo = Date.now() - member.user.createdTimestamp;
    let color: ColorResolvable;
    if (userCreatedAccountAgo > 2419200000 /*4 weeks*/) color = Colors.Green;
    else if (userCreatedAccountAgo > 1209600000 /*2 weeks*/) color = Colors.Yellow;
    else color = Colors.Red;

    const getString = Util.makeGetStringFunction({ defaultLocale: member.guild.preferredLocale });

    const embed = new Embed()
      .setAuthor({
        iconURL: member.displayAvatarURL({ extension: 'png' }),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle(getString('welcome'))
      .setDescription(`${member} ${Formatters.inlineCode(member.user.tag)} (${member.id})`)
      .setFields(
        {
          name: getString('createdAccount'),
          value: Util.makeFormattedTime(Math.floor(member.user.createdTimestamp / 1000)),
        },
        {
          name: getString('joinedServer'),
          value: Util.makeFormattedTime(Math.floor(member.joinedTimestamp! / 1000)),
        },
      )
      .setColor(color);

    const dbGuild = await database.guilds.findOne({ id: member.guild.id });

    await (client.channels.resolve(dbGuild!.channelIds.joinLeave) as TextChannel).send({ embeds: [embed] });
  },
};
