import MessageFormat from '@messageformat/core';
import {
  Collection,
  Colors,
  Formatters,
  GuildBasedChannel,
  GuildMember,
  Locale as DiscordLocale,
  PermissionFlagsBits,
  Snowflake,
  UnsafeEmbedBuilder as Embed,
} from 'discord.js';
import { GetString, GetStringOptions, Locale } from '../types';
import { Locales, PrivateChannels } from './Constants';

export class Util extends null {
  static channelsToGiveAccess(channels: Collection<Snowflake, GuildBasedChannel>, query: string, member: GuildMember) {
    return channels
      .filter(
        (channel) =>
          !PrivateChannels.includes(channel.id) &&
          !channel.isThread() &&
          (channel.id === query || channel.name.toLowerCase().startsWith(query.toLowerCase())) &&
          !channel.permissionsFor(member).has([PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel]),
      )
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .first(25);
  }

  static resolveLocale(locale?: Locale | DiscordLocale) {
    if (Locales.includes(locale as Locale)) return locale as Locale;
    return Locale.EnglishUS;
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

      if (variables && typeof string === 'string')
        string = new MessageFormat(
          {
            [locale]: (value: string | number, ord?: boolean) =>
              new Intl.PluralRules(locale, { type: ord ? 'ordinal' : 'cardinal' }).select(Number(value)),
          }[locale],
        ).compile(string)(variables);

      return string;
    };
  }
}
