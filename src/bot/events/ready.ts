import { Colors, TextChannel, UnsafeEmbedBuilder as Embed } from 'discord.js';
import { AlexBotClientEvent } from '../types';
import { Ids } from '../util/Constants';

export const event: AlexBotClientEvent<'ready'> = {
  name: 'ready',
  once: true,
  listener: async (client) => {
    console.log('Ready');
    if (process.env.NODE_ENV === 'production') {
      const embed = new Embed().setTitle('Ready').setColor(Colors.Green);
      await ((await client.channels.fetch(Ids.channels.botLog)) as TextChannel).send({ embeds: [embed] });
      await client.application.commands.set(client.commands.map((command) => command.data.toJSON()));
    }
  },
};
