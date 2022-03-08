import MessageFormat from '@messageformat/core';
import { CommandInteraction } from 'discord.js';
import { GetStringOptions, Locale } from '../types';
import { AlexClient } from '../util/AlexClient';
import { Util } from '../util/Util';
import autocomplete from './_interactionCreate/autocomplete';
import button from './_interactionCreate/button';
import command from './_interactionCreate/command';
import selectMenu from './_interactionCreate/selectMenu';

export default (client: AlexClient) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const dbUser = await client.db.users.findOne({ id: interaction.user.id }),
      getString = (key: string, options: GetStringOptions = {}) => {
        let {
          fileName = (interaction as CommandInteraction).commandName || 'global',
          locale = dbUser?.locale ?? interaction.locale,
          variables,
        } = options;
        locale = Util.resolveLocale(locale);
        let enStrings = require(`../../strings/en-US/${fileName}`);
        let strings: Record<string, any>;
        try {
          strings = require(`../../strings/${locale}/${fileName}`);
        } catch {
          locale = Locale.EnglishUS;
          strings = require(`../../strings/en-US/${fileName}`);
        }

        key.split('.').forEach((keyPart) => {
          try {
            enStrings = enStrings[keyPart];
            strings = strings[keyPart];
          } catch {
            locale = Locale.EnglishUS;
            strings = enStrings;
          }
        });
        let string: any;
        if (strings) string = strings;
        else {
          locale = Locale.EnglishUS
          string = enStrings;
        }

        if (variables && typeof string === 'string') string = new MessageFormat(locale).compile(string)(variables);

        return string;
      };

    if (interaction.isAutocomplete()) autocomplete(interaction, client);
    else if (interaction.isButton()) button(interaction);
    else if (interaction.isCommand()) command(interaction, client, getString);
    else if (interaction.isSelectMenu()) selectMenu(interaction, getString);
  });
};
