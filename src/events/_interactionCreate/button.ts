import { ButtonInteraction } from 'discord.js';

export default async (interaction: ButtonInteraction<'cached'>) => {
  if (interaction.customId === 'user-report-resolve') {
    interaction.reply({ content: 'This report resolved', ephemeral: true });
  }
  await interaction.message.delete().catch(() => null);
  return;
};
