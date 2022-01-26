import { MessageEmbed } from 'discord.js';
import { Command, DBUser, Locales } from '../../types';

const command: Command = {
  name: 'language',
  description: 'Manages your language',
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'set',
      description: 'Sets your language',
      options: [
        {
          type: 'STRING',
          name: 'language',
          description: 'Language to set your language to',
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'reset',
      description: 'Resets your language',
    },
  ],
  async listener(interaction, client, getString) {
    const subcommand = interaction.options.getSubcommand(true),
      locale = interaction.options.getString('language', subcommand === 'set') as Locales,
      usersCollection = client.db.collection<DBUser>('users'),
      dbUser = await usersCollection.findOne({ id: interaction.user.id });
    if (subcommand === 'set') {
      if (dbUser?.locale === locale) {
        const notChangedEmbed = new MessageEmbed()
          .setTitle(getString('subcommand.set.notChangedEmbed.title'))
          .setDescription(getString('subcommand.set.notChangedEmbed.description'))
          .setColor('RED');
        interaction.reply({ embeds: [notChangedEmbed], ephemeral: true });
      } else {
        await usersCollection.findOneAndUpdate({ id: interaction.user.id }, { $set: { locale } }, { upsert: true });
        const changedEmbed = new MessageEmbed()
          .setTitle(getString('subcommand.set.changedEmbed.title', { locale }))
          .setColor('GREEN');
        interaction.reply({ embeds: [changedEmbed], ephemeral: true });
      }
    } else if (subcommand === 'reset') {
      await usersCollection.findOneAndUpdate({ id: interaction.user.id }, { $unset: { locale: true } });
      const resetEmbed = new MessageEmbed()
        .setTitle(getString('subcommand.reset.resetEmbed.title', { locale: interaction.locale as Locales }))
        .setColor('GREEN');
      interaction.reply({ embeds: [resetEmbed], ephemeral: true });
    }
  },
};

export default command;
