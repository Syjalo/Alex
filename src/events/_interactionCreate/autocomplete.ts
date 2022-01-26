import { AutocompleteInteraction } from 'discord.js';
import { DBLanguage } from '../../types';
import { AlexClient } from '../../util/AlexClient';

export default async (interaction: AutocompleteInteraction, client: AlexClient) => {
  const { name, value } = interaction.options.getFocused(true);
  if (name === 'language' && typeof value === 'string') {
    const languages = await client.db.collection<DBLanguage>('languages').find().toArray();
    const results = languages.filter(
      (language) =>
        language.locale.toLowerCase().startsWith(value.toLowerCase()) ||
        language.name.toLowerCase().startsWith(value.toLowerCase()) ||
        language.nativeName.toLowerCase().startsWith(value.toLowerCase()),
    );
    results.sort((a, b) => (a.nativeName > b.nativeName ? 1 : -1)).splice(25);
    interaction.respond(
      results.map((language) => ({
        name: `${language.nativeName} (${language.name})`,
        value: language.locale,
      })),
    );
  }
};
