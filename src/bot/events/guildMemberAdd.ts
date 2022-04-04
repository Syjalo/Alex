import { ColorResolvable, Colors, Formatters, TextChannel, UnsafeEmbedBuilder as Embed } from 'discord.js';
import { AlexBotClientEvent } from '../types';
import { Ids } from '../util/Constants';
import { Util } from '../util/Util';

export const event: AlexBotClientEvent<'guildMemberAdd'> = {
  name: 'guildMemberAdd',
  listener: async (client, member) => {
    const userCreatedAccountAgo = Date.now() - member.user.createdTimestamp;
    let color: ColorResolvable;
    if (userCreatedAccountAgo > 2419200000 /*4 weeks*/) color = Colors.Green;
    else if (userCreatedAccountAgo > 1209600000 /*2 weeks*/) color = Colors.Yellow;
    else color = Colors.Red;

    const embed = new Embed()
      .setAuthor({
        iconURL: member.displayAvatarURL({ extension: 'png' }),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle('Welcome!')
      .setDescription(`${member} ${Formatters.inlineCode(member.user.tag)} (${member.id})`)
      .setFields(
        {
          name: 'Created the account',
          value: Util.makeFormattedTime(Math.floor(member.user.createdTimestamp / 1000)),
        },
        {
          name: 'Joined the server',
          value: Util.makeFormattedTime(Math.floor(member.joinedTimestamp! / 1000)),
        },
      )
      .setColor(color);

    await (client.channels.resolve(Ids.channels.joinLeave) as TextChannel).send({ embeds: [embed] });
  },
};
