import { ActionRow, ButtonComponent, ButtonStyle, Colors, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { HostnameStatus } from '../types';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  client.on('messageCreate', async (message) => {
    if (!message.inGuild()) return;

    let isDeleted = false;
    const urls = [
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
          .map((url) => new URL(url)),
      ).values(),
    ];
    if (urls.length) {
      const dbHostnames = await client.db.hostnames.find().toArray();
      for (const url of urls) {
        if (dbHostnames.some((dbHostname) => dbHostname.hostname === url.hostname)) {
          if (
            dbHostnames.find((dbHostname) => dbHostname.hostname === url.hostname)!.status === HostnameStatus.Denied
          ) {
            if (isDeleted) continue;
            else {
              await message.delete().catch(() => null);
              isDeleted = true;
            }
          }
        } else {
          const dbHostname = await client.db.hostnames.insertOne({
            hostname: url.hostname,
            status: HostnameStatus.Pending,
          });
          const embed = new Embed()
              .setAuthor({
                iconURL: message.author.displayAvatarURL(),
                name: message.member?.displayName || message.author.username,
                url: Util.makeUserURL(message.author.id),
              })
              .setTitle('An unknown link was found')
              .setDescription(`${message.content}\n\n[Jump](${message.url})`)
              .addField({ name: 'Link', value: url.origin })
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
    if (isDeleted) return;

    if (!message.system) {
      const username = message.member?.displayName || message.author.username;
      switch (message.channel.id) {
        case ids.channels.suggestions:
          message
            .startThread({
              name: `[${username}] Suggestion Discussion`,
              reason: 'New suggestion',
            })
            .catch(() => null);
          await message.react('948824918500474891').catch(() => null);
          await message.react('948824918815043634').catch(() => null);
          break;
      }
    }
  });
};
