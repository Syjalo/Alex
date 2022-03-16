import process from 'node:process';
import { Colors, GatewayIntentBits, Partials, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { config as configENV } from 'dotenv';
import { AlexClient } from './util/AlexClient';
import { ids } from './util/Constants';

if (!process.env.DISCORD_TOKEN) configENV();

const client = new AlexClient({
  failIfNotExists: false,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
});

client.login();

process.on('SIGINT', async () => {
  await client.db.close();
  client.destroy();
  process.exit();
});
process.on('SIGTERM', async () => {
  const destroyEmbed = new Embed().setTitle('Scheduled restart').setColor(Colors.Yellow);
  await Promise.all([
    (client.channels.resolve(ids.channels.botLog) as TextChannel).send({ embeds: [destroyEmbed] }),
    client.db.close(),
  ]);
  client.destroy();
  process.exit();
});
