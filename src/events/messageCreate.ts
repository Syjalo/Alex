import { ActionRow, ButtonComponent, ButtonStyle, Colors, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { ObjectId } from 'mongodb';
import { DBHostname, HostnameStatus } from '../types';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  const pendingHostnames: string[] = [];
  client.on('messageCreate', async (message) => {
    if (!message.inGuild()) return;

    const hostnames = [
      ...new Set(
        message.content
          .split(' ')
          .filter((contentPart) => {
            try {
              return new URL(contentPart).hostname.length;
            } catch {
              return false;
            }
          })
          .map((url) => new URL(url).hostname),
      ).values(),
    ];
    if (hostnames.length) {
      const dbHostnames = await client.db.hostnames.find().toArray();
      for (const hostname of hostnames) {
        if (dbHostnames.some((dbHostname) => dbHostname.hostname === hostname)) {
          if (dbHostnames.find((dbHostname) => dbHostname.hostname === hostname)!.status === HostnameStatus.Denied)
            return void (await message.delete());
        } else {
          const dbHostname = await client.db.hostnames.insertOne({ hostname, status: HostnameStatus.Pending });
          const embed = new Embed()
              .setAuthor({
                iconURL: message.author.displayAvatarURL(),
                name: message.member?.displayName || message.author.username,
                url: Util.makeUserURL(message.author.id),
              })
              .setTitle('An unknown link was found')
              .setDescription(`${message.content}\n\n[Jump](${message.url})`)
              .addField({ name: 'Link', value: hostname })
              .setColor(Colors.Red),
            buttons = new ActionRow().addComponents(
              new ButtonComponent()
                .setCustomId(`hostname-allow:${dbHostname.insertedId}`)
                .setLabel('Allow')
                .setStyle(ButtonStyle.Success),
              new ButtonComponent()
                .setCustomId(`hostname-deny:${dbHostname.insertedId}`)
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger),
            );
          (client.channels.resolve(ids.channels.reports) as TextChannel).send({
            embeds: [embed],
            components: [buttons],
          });
        }
      }
    }

    if (message.channel.id === ids.channels.suggestions && !message.system) {
      message.startThread({
        name: `[${message.member?.displayName || message.author.username}] Suggestion Discussion`,
        reason: 'New suggestion',
      });
      await message.react('857336659465076737').catch(() => null);
      await message.react('857336659619348540').catch(() => null);
      return;
    } else if (message.channel.id === ids.channels.complaints && !message.system) {
      message.startThread({
        name: `[${message.member?.displayName || message.author.username}] Complaint Discussion`,
        reason: 'New complaint',
      });
    }
  });
};
