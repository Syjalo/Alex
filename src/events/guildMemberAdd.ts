import { ColorResolvable, MessageEmbed, TextChannel } from 'discord.js';
import { DBUser } from '../types';
import { AlexClient } from '../util/AlexClient';
import { Ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  client.on('guildMemberAdd', async (member) => {
    const userJoinedDiscordAgo = Date.now() - member.user.createdTimestamp;
    let color: ColorResolvable;
    if (userJoinedDiscordAgo > 1000 * 60 * 60 * 24 * 28 /*4 weeks*/) {
      color = 'GREEN';
    } else if (userJoinedDiscordAgo > 1000 * 60 * 60 * 14 /*2 weeks*/) {
      color = 'YELLOW';
    } else {
      color = 'RED';
    }
    const joinEmbed = new MessageEmbed()
      .setAuthor({
        iconURL: member.displayAvatarURL(),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle('Welcome!')
      .setDescription(`${member} \`${member.user.tag}\` (${member.id})`)
      .addFields([
        {
          name: 'Created account',
          value: Util.makeFormattedTime(Math.floor(member.user.createdTimestamp / 1000)),
        },
        {
          name: 'Joined Server',
          value: Util.makeFormattedTime(Math.floor(member.joinedTimestamp! / 1000)),
        },
      ])
      .setColor(color);
    (client.channels.resolve(Ids.channels.joinLeave) as TextChannel).send({ embeds: [joinEmbed] });

    const usersCollection = client.db.collection<DBUser>('users'),
      dbUser = await usersCollection.findOne({ id: member.id });
    if (dbUser && dbUser.savedRoles) {
      member.roles.add(dbUser.savedRoles);
      usersCollection.findOneAndUpdate({ id: member.id }, { $unset: { savedRoles: true } });
    }
  });
};
