import { ButtonInteraction } from 'discord.js';

export const button = async (interaction: ButtonInteraction<'cached'>) => {
  if (interaction.customId === 'user-report-resolve') {
    await interaction.reply({ content: 'This report resolved', ephemeral: true });
    await interaction.message.delete().catch(() => null);
  }
  return;
};
