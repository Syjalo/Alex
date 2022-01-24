import { Snowflake } from 'discord-api-types';
import { GuildMember, MessageEmbed, User } from 'discord.js';
import { GetString } from '../types';
import { Locales } from './Constants';

export class Util extends null {
  static resolveLocale(locale?: string) {
    if (!locale || !Locales.includes(locale)) return 'en-US';
    return locale;
  }

  static makeUserURL(id: Snowflake) {
    return `https://discord.com/users/${id}`;
  }

  static makeFormattedTime(timestamp: number) {
    return `<t:${timestamp}> (<t:${timestamp}:R>)`;
  }
}
