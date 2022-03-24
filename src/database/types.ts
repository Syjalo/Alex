import { Snowflake } from 'discord.js';
import { Locale } from '../bot/types';

export interface DBUser {
  id: Snowflake;
  locale: Locale;
  savedRoles?: Snowflake[];
}

export interface DBLanguage {
  locale: Locale;
  name: string;
  nativeName: string;
}
