import { ChatInputCommandInteraction, Colors, UnsafeEmbedBuilder as Embed } from 'discord.js';
import { database } from '../../../../database';
import { GetString, Locale } from '../../../types';
import { Locales } from '../../../util/Constants';

export const set = async (interaction: ChatInputCommandInteraction<'cached'>, getString: GetString) => {
  let locale = interaction.options.getString('language', true) as Locale;
  const dbMember = await database.members.findOne({ id: interaction.user.id, guildId: interaction.guildId }),
    dbLanguage = await database.languages
      .find()
      .toArray()
      .then((languages) =>
        languages.find(
          (language) =>
            language.locale.toLowerCase().startsWith(locale.toLowerCase()) ||
            language.name.toLowerCase().startsWith(locale.toLowerCase()) ||
            language.nativeName.toLowerCase().startsWith(locale.toLowerCase()),
        ),
      );
  if (dbLanguage) locale = dbLanguage.locale;

  if (!Locales.includes(locale)) {
    const embed = new Embed()
      .setTitle(getString('subcommand.set.unknownLanguage.title'))
      .setDescription(
        getString('subcommand.set.unknownLanguage.description', { variables: { query: `\`${locale}\`` } }),
      )
      .setColor(Colors.Red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  if (dbMember?.locale === locale) {
    const embed = new Embed()
      .setTitle(getString('subcommand.set.notChangedEmbed.title'))
      .setDescription(getString('subcommand.set.notChangedEmbed.description'))
      .setColor(Colors.Red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  await database.members.findOneAndUpdate({ id: interaction.user.id }, { $set: { locale } }, { upsert: true });
  const embed = new Embed().setTitle(getString('subcommand.set.changedEmbed.title', { locale })).setColor(Colors.Green);
  if (locale !== 'en-US') embed.setDescription(getString('subcommand.set.changedEmbed.description', { locale }));
  await interaction.reply({ embeds: [embed], ephemeral: true });
};
