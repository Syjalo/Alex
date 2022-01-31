import { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js';
import { DBHostname } from '../types';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  const pendingHostnames: string[] = [];
  client.on('messageCreate', async (message) => {
    if (!message.inGuild()) return;
    const rawURLs = [
      ...new Set(
        message.content
          .replaceAll('\n', ' ')
          .split(' ')
          .filter((el) => {
            try {
              return new URL(el).hostname.length;
            } catch {
              return false;
            }
          }),
      ).values(),
    ];
    if (rawURLs.length) {
      const [hostnamesWhitelist, hostnamesBlacklist] = await Promise.all([
        (
          await client.db.collection<DBHostname>('hostnamesWhitelist').find().toArray()
        ).map((dbHostname) => dbHostname.hostname),
        (
          await client.db.collection<DBHostname>('hostnamesBlacklist').find().toArray()
        ).map((dbHostname) => dbHostname.hostname),
      ]);
      for (const rawURL of rawURLs) {
        const url = new URL(rawURL);
        const { hostname } = url;
        if (hostnamesBlacklist.includes(hostname)) {
          await message.delete();
          return;
        } else if (!hostnamesWhitelist.includes(hostname)) {
          if (pendingHostnames.includes(hostname)) continue;
          pendingHostnames.push(hostname);
          const embed = new MessageEmbed()
              .setAuthor({
                iconURL: message.author.displayAvatarURL(),
                name: message.member?.displayName || message.author.username,
                url: Util.makeUserURL(message.author.id),
              })
              .setTitle('An unknown link was found')
              .setDescription(`${message.content}\n\n[Jump](${message.url})`)
              .addField('Link', url.origin)
              .setColor('RED'),
            buttons = new MessageActionRow().addComponents([
              new MessageButton().setCustomId(`hostname-allow:${hostname}`).setLabel('Allow').setStyle('SUCCESS'),
              new MessageButton().setCustomId(`hostname-deny:${hostname}`).setLabel('Deny').setStyle('DANGER'),
            ]);
          (client.channels.resolve(ids.channels.reports) as TextChannel).send({
            embeds: [embed],
            components: [buttons],
          });
        }
      }
    }

    if (message.channel.id === ids.channels.suggestions && !message.system) {
      message.startThread({
        name: `[${message.member!.displayName}] Suggestion Discussion`,
        reason: 'New suggestion',
      });
      await message.react('857336659465076737').catch(() => null);
      await message.react('857336659619348540').catch(() => null);
      return;
    } else if (message.channel.id === ids.channels.complaints && !message.system) {
      message.startThread({
        name: `[${message.member!.displayName}] Complaint Discussion`,
        reason: 'New complaint',
      });
    }
  });
};
