import { Awaitable, ChatInputApplicationCommandData, ChatInputCommandInteraction, Snowflake } from 'discord.js';
import { AlexClient } from './util/AlexClient';

export interface Command extends ChatInputApplicationCommandData {
  listener(
    interaction: ChatInputCommandInteraction<'cached'>,
    client: AlexClient,
    getString: GetString,
  ): Awaitable<void>;
  dev?: true;
  allowedRoles?: Snowflake[];
  allowedUsers?: Snowflake[];
  cooldown?: number;
}

export interface DBUser {
  id: Snowflake;
  locale: Locale;
  savedRoles?: Snowflake[];
}

export interface DBHostname {
  hostname: string;
  status: HostnameStatus;
}

export interface DBLanguage {
  locale: Locale;
  name: string;
  nativeName: string;
}

export interface GetStringOptions {
  variables?: Record<string, string | number>;
  fileName?: string;
  locale?: Locale;
}

export interface NameHistory {
  name: string;
  changedToAt?: number;
}

export enum HostnameStatus {
  Pending,
  Allowed,
  Denied,
}

export type GetString = <T extends any = any>(key: string, options?: GetStringOptions) => T;

export enum Locale {
  Bulgarian = 'bg',
  Czech = 'cs',
  Danish = 'da',
  German = 'de',
  Greek = 'el',
  EnglishUS = 'en-US',
  EnglishGB = 'en-GB',
  SpanishES = 'es-ES',
  Finnish = 'fi',
  French = 'fr',
  Hindi = 'hi',
  Croatian = 'hr',
  Hungarian = 'hu',
  Indonesian = 'id',
  Italian = 'it',
  Japanese = 'ja',
  Korean = 'ko',
  Lithuanian = 'lt',
  Dutch = 'nl',
  Norwegian = 'no',
  Polish = 'pl',
  PortugueseBR = 'pt-BR',
  Romanian = 'ro',
  Russian = 'ru',
  Swedish = 'sv-SE',
  Thai = 'th',
  Turkish = 'tr',
  Ukrainian = 'uk',
  Vietnamese = 'vi',
  ChineseCN = 'zh-CN',
  ChineseTW = 'zh-TW',
}
