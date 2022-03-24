import { SlashCommandBuilder } from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import {
  Awaitable,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ClientEvents,
  Locale as DiscordLocale,
  Snowflake,
} from 'discord.js';
import { AlexBotClient } from './util/AlexBotClient';

export interface AlexBotChatInputApplicationCommandData extends ChatInputApplicationCommandData {
  cooldown?: number;
  allowedRoles?: Snowflake[];
  allowedUsers?: Snowflake[];
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
  Indonesian = 'id',
  Russian = 'ru',
  Turkish = 'tr',
  Ukrainian = 'uk',
}
