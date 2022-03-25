import { Colors, Formatters, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { Ids, RolesToSave } from '../util/Constants';
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
          value: Util.makeFormattedTime(Math.floor(Date.now() / 1000)),
        },
        {
          name: 'Left the server',
          value: Util.makeFormattedTime(Math.floor(Date.now() / 1000)),
        },
      )
      .setColor(Colors.LightGrey);
    await (client.channels.resolve(Ids.channels.joinLeave) as TextChannel).send({ embeds: [embed] });

    const rolesToSave = RolesToSave.filter((id) => member.roles.cache.has(id));
    if (rolesToSave.length > 0)
      await database.users.findOneAndUpdate({ id: member.id }, { $set: { savedRoles: rolesToSave } }, { upsert: true });
  },
};
