import {
  Awaitable,
  ChatInputCommandInteraction,
  ClientEvents,
  Locale as DiscordLocale,
  SlashCommandBuilder,
} from 'discord.js';
import { AlexBotClient } from './util/AlexBotClient';

export interface AlexBotChatInputCommand {
  data: Pick<SlashCommandBuilder, 'name' | 'toJSON'>;
  cooldown?: number;
  dev?: true;
  listener: (
    interaction: ChatInputCommandInteraction<'cached'>,
    client: AlexBotClient,
    getString: GetString,
  ) => Awaitable<void>;
}

export interface AlexBotClientEvent<K extends keyof ClientEvents> {
  name: K;
  once?: true;
  condition?: boolean;
  listener: (client: AlexBotClient, ...args: ClientEvents[K]) => Awaitable<void>;
}

export interface GetStringOptions {
  variables?: Record<string, string | number>;
  fileName?: string;
  locale?: Locale | DiscordLocale;
}

export interface MojangAPINameHistory {
  name: string;
  changedToAt?: number;
}

export interface MojangAPIUsernameToUUID {
  name: string;
  id: string;
}

export type GetString = (key: string, options?: GetStringOptions) => any;

export type MojangAPIUUIDToNameHistory = MojangAPINameHistory[];

export enum Locale {
  Czech = 'cs',
  EnglishUS = 'en-US',
  Hungarian = 'hu',
  Indonesian = 'id',
  PortugueseBR = 'pt-BR',
  Russian = 'ru',
  Turkish = 'tr',
  Ukrainian = 'uk',
}
