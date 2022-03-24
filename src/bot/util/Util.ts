import MessageFormat from '@messageformat/core';
import { Colors, Formatters, Locale as DiscordLocale, Snowflake, UnsafeEmbed as Embed } from 'discord.js';
import { GetString, GetStringOptions, Locale } from '../types';
import { Locales } from './Constants';

export class Util extends null {
  static resolveLocale(locale?: Locale | DiscordLocale) {
    if (!locale || !Locales.includes(locale as Locale)) return Locale.EnglishUS;
    return locale as Locale;
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
    return `${Formatters.time(timestamp)} (${Formatters.time(timestamp, 'R')})`;
  }

  static makeGetStringFunction(options: { defaultFileName?: string; defaultLocale?: Locale | DiscordLocale } = {}) {
    const { defaultFileName, defaultLocale } = options;
    return (key: string, options: GetStringOptions = {}) => {
      let { fileName = defaultFileName || 'global', locale = defaultLocale || Locale.EnglishUS, variables } = options;
      locale = Util.resolveLocale(locale);
      let enStrings = require(`../../../strings/en-US/${fileName}`);
      let strings: Record<string, any>;
      try {
        strings = require(`../../../strings/${locale}/${fileName}`);
      } catch {
        strings = require(`../../../strings/en-US/${fileName}`);
      }

      key.split('.').forEach((keyPart) => {
        try {
          enStrings = enStrings[keyPart];
          strings = strings[keyPart];
        } catch {
          strings = enStrings;
        }
      });
      let string: any;
      if (strings) string = strings;
      else string = enStrings;

      if (string === enStrings) locale = Locale.EnglishUS;

      if (variables && typeof string === 'string') string = new MessageFormat(locale).compile(string)(variables);

      return string;
    };
  }
}
