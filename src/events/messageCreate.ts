import { AlexClient } from '../util/AlexClient';
import { Ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageCreate', async (message) => {
    if (message.channel.id === Ids.channels.suggestions && message.type === 'DEFAULT') {
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
