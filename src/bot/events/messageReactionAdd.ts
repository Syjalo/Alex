import { parseEmoji } from 'discord.js';
import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { Emojis } from '../util/Constants';

export const event: AlexBotClientEvent<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  listener: async (client, reaction, user) => {
    if (!reaction.message.inGuild()) return;
    if (reaction.partial) {
      await reaction.fetch().catch(() => null);
      if (reaction.partial) return;
    }
    const dbGuild = await database.guilds.findOne({ id: reaction.message.guild.id });

    if (reaction.message.channel.id === dbGuild!.channelIds.suggestions) {
      if (reaction.message.author.id === user.id) await reaction.users.remove(user.id);
      if (user.id === client.user.id) return;
      await Promise.all(reaction.message.reactions.cache.map((r) => r.users.fetch({ limit: 100 })));
      reaction.message.reactions.cache
        .find(
          (r) =>
            [Emojis.allowed, Emojis.denied].map((emoji) => parseEmoji(emoji)!.id).includes(r.emoji.id) &&
            r.users.cache.has(user.id) &&
            r.emoji.id! !== reaction.emoji.id!,
        )
        ?.users.remove(user.id);
    }
  },
};
