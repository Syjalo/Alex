import { ColorResolvable, Colors, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  client.on('guildMemberAdd', async (member) => {
    const userCreatedAccountAgo = Date.now() - member.user.createdTimestamp;
    let color: ColorResolvable;
    if (userCreatedAccountAgo > 1000 * 60 * 60 * 24 * 28 /*4 weeks*/) {
      color = Colors.Green;
    } else if (userCreatedAccountAgo > 1000 * 60 * 60 * 24 * 14 /*2 weeks*/) {
      color = Colors.Yellow;
    } else {
      color = Colors.Red;
    }
    const joinEmbed = new Embed()
      .setAuthor({
        iconURL: member.displayAvatarURL(),
        name: member.displayName,
        url: Util.makeUserURL(member.id),
      })
      .setTitle('Welcome!')
      .setDescription(`${member} \`${member.user.tag}\` (${member.id})`)
      .addFields(
        {
          name: 'Created account',
          value: Util.makeFormattedTime(Math.floor(member.user.createdTimestamp / 1000)),
        },
        {
          name: 'Joined Server',
          value: Util.makeFormattedTime(Math.floor(member.joinedTimestamp! / 1000)),
        },
      )
      .setColor(color);
    (client.channels.resolve(ids.channels.joinLeave) as TextChannel).send({ embeds: [joinEmbed] });
  });
};
