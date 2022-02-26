import { Colors, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  client.on('guildMemberRemove', (member) => {
    const leaveEmbed = new Embed()
      .setAuthor({
        iconURL: member.displayAvatarURL(),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle('Goodbye!')
      .setDescription(`${member} \`${member.user.tag}\` (${member.id})`)
      .setFields(
        {
          name: 'Created account',
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(
            member.user.createdTimestamp / 1000,
          )}:R>)`,
        },
        {
          name: 'Leave Server',
          value: `<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
        },
      )
      .setColor(Colors.LightGrey);
    (client.channels.resolve(ids.channels.joinLeave) as TextChannel).send({ embeds: [leaveEmbed] });

    const rolesToSave = ids.rolesToSave.filter((roleId) => member.roles.cache.has(roleId));
    if (rolesToSave.length > 0) {
      client.db.users.findOneAndUpdate({ id: member.id }, { $set: { savedRoles: rolesToSave } }, { upsert: true });
    }
  });
};
