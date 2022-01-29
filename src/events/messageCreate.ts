import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageCreate', async (message) => {
    const hosts =
      message.content
        .match(/(?:http[s]?:\/\/)?([\w.-]+(?:\.[\w\.-]+))+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+/gm)
        ?.map((host) => host.toLowerCase())
        .filter((host) => host.includes('discord') && host.includes('gift')) || [];

    if (hosts.some((host) => host !== 'discord.gift')) {
      await message.delete();
      return;
    }

    if (message.channel.id === ids.channels.suggestions && message.type === 'DEFAULT') {
      message.startThread({
        name: `[${message.member!.displayName}] Suggestion Discutions`,
        reason: 'New suggestion',
      });
      await message.react('857336659465076737').catch(() => null);
      await message.react('857336659619348540').catch(() => null);
      return;
    }
  });
};
