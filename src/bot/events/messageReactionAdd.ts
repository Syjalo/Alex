import { AlexBotClientEvent } from '../types';
import { Ids } from '../util/Constants';

export const event: AlexBotClientEvent<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  listener: async (_, reaction, user) => {
    if (reaction.partial) {
      await reaction.fetch().catch(() => null);
      if (reaction.partial) return;
    }
    if (reaction.message.partial) {
      await reaction.message.fetch().catch(() => null);
      if (reaction.message.partial) return;
    }

    if (reaction.message.channel.id === Ids.channels.suggestions && reaction.message.author.id === user.id)
      await reaction.users.remove(user.id);
  },
};
