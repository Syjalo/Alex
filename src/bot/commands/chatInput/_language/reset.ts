import { ChatInputCommandInteraction, Colors, UnsafeEmbed as Embed } from 'discord.js';
import { database } from '../../../../database';
import { GetString } from '../../../types';

export const reset = async (interaction: ChatInputCommandInteraction<'cached'>, getString: GetString) => {
  await database.members.findOneAndUpdate(
    { id: interaction.user.id, guildId: interaction.guildId },
    { $unset: { locale: true } },
  );
  const embed = new Embed()
    .setTitle(getString('subcommand.reset.resetEmbed.title', { locale: interaction.locale }))
    .setColor(Colors.Green);
  await interaction.reply({ embeds: [embed], ephemeral: true });
};
