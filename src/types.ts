import { Awaitable, ChatInputApplicationCommandData, ChatInputCommandInteraction, CommandInteraction, Snowflake } from 'discord.js';
import { AlexClient } from './util/AlexClient';

export interface Command extends ChatInputApplicationCommandData {
  listener(interaction: ChatInputCommandInteraction, client: AlexClient, getString: GetString): Awaitable<void>;
  dev?: true;
  allowedRoles?: Snowflake[];
  cooldown?: number;
}

export interface DBUser {
  id: Snowflake;
  locale: Locales;
  savedRoles?: Snowflake[];
}

export interface DBHostname {
  hostname: string;
}

export interface DBLanguage {
  locale: Locales;
  name: string;
  nativeName: string;
}

export interface GetStringOptions {
  variables?: Record<string, string | number>;
  fileName?: string;
  locale?: Locales;
}

export interface NameHistory {
  name: string;
  changedToAt?: number;
}

export type GetString = <T extends any = any>(key: string, options?: GetStringOptions) => T;

export type Locales =
  | 'bg'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en-GB'
  | 'en-US'
  | 'es-ES'
  | 'fi'
  | 'fr'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'lt'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt-BR'
  | 'ro'
  | 'ru'
  | 'sv-SE'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW';
