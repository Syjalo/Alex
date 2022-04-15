import { database } from '../../database';
import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  listener: async (_, reaction, user) => {
    if (!reaction.message.inGuild()) return;
    if (reaction.partial) {
      await reaction.fetch().catch(() => null);
      if (reaction.partial) return;
    }
    const dbGuild = await database.guilds.findOne({ id: reaction.message.guild.id });

    if (reaction.message.channel.id === dbGuild!.channelIds.suggestions && reaction.message.author.id === user.id)
      await reaction.users.remove(user.id);
  },
};
