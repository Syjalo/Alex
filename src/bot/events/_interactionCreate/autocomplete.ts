import { AutocompleteInteraction } from 'discord.js';
import { database } from '../../../database';
import { Util } from '../../util/Util';

export const autocomplete = async (interaction: AutocompleteInteraction<'cached'>) => {
  const { name, value } = interaction.options.getFocused(true);

  if (name === 'channel') {
    const results = Util.channelsToGiveAccess(interaction.guild.channels.cache, value, interaction.member);
    await interaction.respond(
      results.map((channel) => ({
        name: `${channel.name} (${channel.id})`,
        value: channel.id,
      })),
    );
  } else if (name === 'language') {
    const languages = await database.languages.find().toArray();
    const results = languages.filter(
      (language) =>
        language.locale.toLowerCase().startsWith(value.toLowerCase()) ||
        language.name.toLowerCase().startsWith(value.toLowerCase()) ||
        language.nativeName.toLowerCase().startsWith(value.toLowerCase()),
    );
    results.sort((a, b) => (a.nativeName > b.nativeName ? 1 : -1)).splice(25);
    await interaction.respond(
      results.map((language) => ({
        name: `${language.nativeName} (${language.name})`,
        value: language.locale,
      })),
    );
  }
};
