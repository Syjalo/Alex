import { ApplicationCommandOptionType, Colors, UnsafeEmbed as Embed } from 'discord.js';
import { Command, DBLanguage, DBUser, Locales } from '../../types';
import { locales } from '../../util/Constants';

const command: Command = {
  name: 'language',
  description: 'Manages your language',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'set',
      description: 'Sets your language',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'language',
          description: 'Language to set your language to',
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'reset',
      description: 'Resets your language',
    },
  ],
  async listener(interaction, client, getString) {
    const subcommand = interaction.options.getSubcommand(true),
      usersCollection = client.db.users,
      dbUser = await usersCollection.findOne({ id: interaction.user.id });
    let locale = interaction.options.getString('language', subcommand === 'set') as Locales;

    if (subcommand === 'set') {
      const dbLanguages = await client.db.languages.find().toArray();
      const dbLanguage = dbLanguages.find(
        (language) =>
          language.locale.toLowerCase().startsWith(locale.toLowerCase()) ||
          language.name.toLowerCase().startsWith(locale.toLowerCase()) ||
          language.nativeName.toLowerCase().startsWith(locale.toLowerCase()),
      );
      if (dbLanguage) locale = dbLanguage.locale;
      if (!locales.includes(locale)) {
        const unknownLanguage = new Embed()
          .setTitle(getString('subcommand.set.unknownLanguage.title'))
          .setDescription(
            getString('subcommand.set.unknownLanguage.description', { variables: { query: `\`${locale}\`` } }),
          )
          .setColor(Colors.Red);
        interaction.reply({ embeds: [unknownLanguage], ephemeral: true });
        return;
      }
      if (dbUser?.locale === locale) {
        const notChangedEmbed = new Embed()
          .setTitle(getString('subcommand.set.notChangedEmbed.title'))
          .setDescription(getString('subcommand.set.notChangedEmbed.description'))
          .setColor(Colors.Red);
        interaction.reply({ embeds: [notChangedEmbed], ephemeral: true });
      } else {
        await usersCollection.findOneAndUpdate({ id: interaction.user.id }, { $set: { locale } }, { upsert: true });
        const changedEmbed = new Embed()
          .setTitle(getString('subcommand.set.changedEmbed.title', { locale }))
          .setColor(Colors.Green);
        if (locale !== 'en-US')
          changedEmbed.setDescription(getString('subcommand.set.changedEmbed.description', { locale }));
        interaction.reply({ embeds: [changedEmbed], ephemeral: true });
      }
    } else if (subcommand === 'reset') {
      await usersCollection.findOneAndUpdate({ id: interaction.user.id }, { $unset: { locale: true } });
      const resetEmbed = new Embed()
        .setTitle(getString('subcommand.reset.resetEmbed.title', { locale: interaction.locale as Locales }))
        .setColor(Colors.Green);
      interaction.reply({ embeds: [resetEmbed], ephemeral: true });
    }
  },
};

export default command;
