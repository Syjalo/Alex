import { Colors, EmbedBuilder as Embed, Formatters, TextChannel } from 'discord.js';
import { inspect } from 'util';
import { AlexBotClientEvent } from '../types';
import { Ids } from '../util/Constants';

export const event: AlexBotClientEvent<'error'> = {
  name: 'error',
  listener: async (client, error) => {
    console.log(error);
    const embed = new Embed()
      .setTitle('An error occurred')
      .setDescription(Formatters.codeBlock(inspect(error).substring(0, 4089)))
      .setColor(Colors.Red);
    await ((await client.channels.fetch(Ids.channels.botLog)) as TextChannel).send({
      content: `<@${Ids.developer}>`,
      embeds: [embed],
    });
  },
};
