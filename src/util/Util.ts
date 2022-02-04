import { Snowflake } from 'discord-api-types';
import { MessageEmbed } from 'discord.js';
import { GetString, Locales } from '../types';
import { locales } from './Constants';

export class Util extends null {
  static resolveLocale(locale?: Locales) {
    if (!locale || !locales.includes(locale)) return 'en-US';
    return locale;
  }

  static makeErrorEmbed(error: any, getString: GetString) {
    return error.stack
      ? new MessageEmbed()
          .setTitle(getString('unexpectedError', { fileName: 'errors', variables: { error: `${error.stack}` } }))
          .setColor('RED')
      : new MessageEmbed().setTitle(getString(error, { fileName: 'errors' })).setColor('RED');
  }

  static makeUserURL(id: Snowflake) {
    return `https://discord.com/users/${id}`;
  }

  static makeFormattedTime(timestamp: number) {
    return `<t:${timestamp}> (<t:${timestamp}:R>)`;
  }
}
