import { REST } from '@discordjs/rest';
import { Client, GatewayIntentBits, GuildMember, Partials, ThreadMember, User } from 'discord.js';
import { AlexBotClient } from './util/AlexBotClient';

const sweeperInterval = 900,
  structureLifetime = 1_800,
  sweeperDefaultFilter = () => () => true,
  sweeperUserFilter = () => (user: GuildMember | ThreadMember | User) =>
    user.id !== (user.client as Client<true>).user.id;
export const client = new AlexBotClient({
  allowedMentions: {
    parse: ['roles', 'users'],
    repliedUser: true,
  },
  failIfNotExists: false,
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
  sweepers: {
    guildMembers: {
      interval: sweeperInterval,
      filter: sweeperUserFilter,
    },
    messages: {
      interval: sweeperInterval,
      lifetime: structureLifetime,
    },
    presences: {
      interval: sweeperInterval,
      filter: sweeperDefaultFilter,
    },
    threadMembers: {
      interval: sweeperInterval,
      filter: sweeperUserFilter,
    },
    threads: {
      interval: sweeperInterval,
      lifetime: structureLifetime,
    },
    users: {
      interval: sweeperInterval,
      filter: sweeperUserFilter,
    },
  },
  rest: {
    globalRequestsPerSecond: 50,
  },
});

export const rest = new REST({ globalRequestsPerSecond: 50 }).setToken(process.env.DISCORD_TOKEN!);

client.login();
