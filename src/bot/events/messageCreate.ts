import { AlexBotClientEvent } from '../types';
import { Emojis, Ids } from '../util/Constants';

export const event: AlexBotClientEvent<'messageCreate'> = {
  name: 'messageCreate',
  listener: async (_, message) => {
    if (message.system || !message.inGuild()) return;
    if (!message.member) {
      await message.guild.members.fetch(message.author).catch(() => null);
      if (!message.member) return;
    }

    if (message.channelId === Ids.channels.suggestions) {
      await message
        .startThread({
          name: `[${message.member.displayName}] Suggestion Discussion`,
          reason: 'New suggestion',
        })
        .catch(() => null);
      await message.react(Emojis.allowed).catch(() => null);
      await message.react(Emojis.denied).catch(() => null);
    }
  },
};
