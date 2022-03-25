// organize-imports-ignore
import 'dotenv/config';
import './bot';
import './database';
import './spotify';

import { Routes } from 'discord-api-types/v10';
import { Colors, Embed, Formatters } from 'discord.js';
import process from 'node:process';
import { inspect } from 'util';
import { client, rest } from './bot';
import { Ids } from './bot/util/Constants';
import { database } from './database';

const signalsListener = async () => {
  const promises: Promise<unknown>[] = [database.close()];
  if (process.env.NODE_ENV === 'production') {
    const embed = new Embed().setTitle('Scheduled restart').setColor(Colors.Yellow);
    promises.push(
      rest.post(Routes.channelMessages(Ids.channels.botLog), {
        body: { embeds: [embed.toJSON()] },
      }),
    );
  }
  await Promise.all(promises);
  client.destroy();
  process.exit();
};
process.on('SIGINT', signalsListener);
process.on('SIGTERM', signalsListener);

if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', async (error) => {
    console.log(error);
    const embed = new Embed()
      .setTitle('An uncaught exception')
      .setDescription(Formatters.codeBlock(inspect(error).substring(0, 4089)))
      .setColor(Colors.Red);
    await rest.post(Routes.channelMessages(Ids.channels.botLog), {
      body: { content: `<@${Ids.developer}>`, embeds: [embed.toJSON()] },
    });
  });
  process.on('unhandledRejection', async (reason, promise) => {
    console.log(reason, promise);
    const embed = new Embed()
      .setTitle('An unhandled rejection')
      .setDescription(Formatters.codeBlock(inspect(reason).substring(0, 4089)))
      .setColor(Colors.Red);
    await rest.post(Routes.channelMessages(Ids.channels.botLog), {
      body: { content: `<@${Ids.developer}>`, embeds: [embed.toJSON()] },
    });
  });
}
