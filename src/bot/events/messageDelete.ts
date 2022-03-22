import { TextChannel } from 'discord.js';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageDelete', async (message) => {
    if (message.channel.id === ids.channels.suggestions) {
      const thread = await (message.channel as TextChannel).threads.fetch(message.id).catch(() => null);
      if (thread) thread.delete('Original message was deleted');
    }
  });
};
