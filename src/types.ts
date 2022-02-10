import { Awaitable, ChatInputApplicationCommandData, CommandInteraction, Snowflake } from 'discord.js';
import { AlexClient } from './util/AlexClient';

export interface Command extends ChatInputApplicationCommandData {
  listener(interaction: CommandInteraction, client: AlexClient, getString: GetString): Awaitable<void>;
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

interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  name: string;
}

export interface SpotifyTrack {
  album: {
    external_urls: {
      spotify: string;
    };
    name: string;
  };
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
  name: string;
}

export type GetString = <T extends any>(key: string, options?: GetStringOptions) => T;

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
