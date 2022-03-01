import { Colors, Snowflake, UnsafeEmbed as Embed } from 'discord.js';
import { GetString, Locale } from '../types';
import { locales } from './Constants';

export class Util extends null {
  static resolveLocale(locale?: Locale) {
    if (!locale || !locales.includes(locale)) return 'en-US';
    return locale;
  }

  static makeErrorEmbed(error: any, getString: GetString) {
    return error.stack
      ? new Embed()
          .setTitle(getString('unexpectedError', { fileName: 'errors', variables: { error: `${error.stack}` } }))
          .setColor(Colors.Red)
      : new Embed().setTitle(getString(error, { fileName: 'errors' })).setColor(Colors.Red);
  }

  static makeUserURL(id: Snowflake) {
    return `https://discord.com/users/${id}`;
  }

  static makeFormattedTime(timestamp: number) {
    return `<t:${timestamp}> (<t:${timestamp}:R>)`;
  }
}
