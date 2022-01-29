import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageCreate', async (message) => {
    const hosts =
      message.content
        .match(/([\w.-]+(?:\.[\w\.-]+)+)/g)
        ?.map((host) => host.toLowerCase())
        .filter((host) => host.includes('discord') && host.includes('gift')) || [];

    if (hosts.some((host) => host !== 'discord.gift')) {
      await message.delete();
      return;
    }

    if (message.channel.id === ids.channels.suggestions && message.type === 'DEFAULT') {
      message.startThread({
        name: `[${message.member!.displayName}] Suggestion Discussion`,
        reason: 'New suggestion',
      });
      await message.react('857336659465076737').catch(() => null);
      await message.react('857336659619348540').catch(() => null);
      return;
    } else if (message.channel.id === '919554638452236308' && message.type === 'DEFAULT') {
      message.startThread({
        name: `[${message.member!.displayName}] Complaint Discussion`,
        reason: 'New complaint',
      });
    }
  });
};
