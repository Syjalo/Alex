import { TextChannel } from 'discord.js';
import { database } from '../../database';
import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'messageDelete'> = {
  name: 'messageDelete',
  listener: async (_, message) => {
    if (message.system || !message.inGuild()) return;
    const dbGuild = await database.guilds.findOne({ id: message.guild.id });

    if (message.channelId === dbGuild!.channelIds.suggestions) {
      const thread = await (message.channel as TextChannel).threads.fetch(message.id).catch(() => null);
      if (thread) await thread.delete('Original message was deleted');
    }
  },
};
