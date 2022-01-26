import { Snowflake } from 'discord-api-types';
import { Locales } from '../types';
import { locales } from './Constants';

export class Util extends null {
  static resolveLocale(locale?: Locales) {
    if (!locale || !locales.includes(locale)) return 'en-US';
    return locale;
  }

  static makeUserURL(id: Snowflake) {
    return `https://discord.com/users/${id}`;
  }

  static makeFormattedTime(timestamp: number) {
    return `<t:${timestamp}> (<t:${timestamp}:R>)`;
  }
}
