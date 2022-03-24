import { TextChannel } from 'discord.js';
import { AlexBotClientEvent } from '../types';
import { Ids } from '../util/Constants';

export const event: AlexBotClientEvent<'messageDelete'> = {
  name: 'messageDelete',
  listener: async (_, message) => {
    if (message.system || !message.inGuild()) return;

    if (message.channelId === Ids.channels.suggestions) {
      const thread = await (message.channel as TextChannel).threads.fetch(message.id).catch(() => null);
      if (thread) await thread.delete('Original message was deleted');
    }
  },
};
