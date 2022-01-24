import { MessageEmbed, TextChannel } from 'discord.js';
import { DBUser } from '../types';
import { AlexClient } from '../util/AlexClient';
import { Ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  client.on('guildMemberRemove', (member) => {
    const leaveEmbed = new MessageEmbed()
      .setAuthor({
        iconURL: member.displayAvatarURL(),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle('Goodbye!')
      .setFields([
        {
          name: 'Username',
          value: `${member} \`${member.user.tag}\` (${member.id})`,
        },
        {
          name: 'Joined Discord',
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(
            member.user.createdTimestamp / 1000,
          )}:R>)`,
        },
        {
          name: 'Leave Server',
          value: `<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
        },
      ])
      .setColor('LIGHT_GREY');
    (client.channels.resolve(Ids.channels.joinLeave) as TextChannel).send({ embeds: [leaveEmbed] });

    const rolesToSave = Ids.rolesToSave.filter((roleId) => member.roles.cache.has(roleId));
    if (rolesToSave.length > 0) {
      client.db
        .collection<DBUser>('users')
        .findOneAndUpdate({ id: member.id }, { $set: { savedRoles: rolesToSave } }, { upsert: true });
    }
  });
};
