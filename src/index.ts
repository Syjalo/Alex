import process from 'node:process';
import { Intents, MessageEmbed, TextChannel } from 'discord.js';
import { config as configENV } from 'dotenv';
import { AlexClient } from './util/AlexClient';
import { ids } from './util/Constants';

if (!process.env.DISCORD_TOKEN) configENV();

const client = new AlexClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});

client.login();

process.on('SIGINT', async () => {
  await client.db.close();
  client.destroy();
  process.exit();
});
process.on('SIGTERM', async () => {
  const destroyEmbed = new MessageEmbed().setTitle('Scheduled restart').setColor('YELLOW');
  await Promise.all([
    (client.channels.resolve(ids.channels.botLog) as TextChannel).send({ embeds: [destroyEmbed] }),
    client.db.close(),
  ]);
  client.destroy();
  process.exit();
});
