import { ButtonInteraction } from 'discord.js';
import { ObjectId } from 'mongodb';
import { HostnameStatus } from '../../types';
import { AlexClient } from '../../util/AlexClient';

export default async (interaction: ButtonInteraction<'cached'>, client: AlexClient) => {
  const [action, data] = interaction.customId.split(':');
  if (action.startsWith('hostname') || action.startsWith('user-report-resolve')) {
    if (action === 'hostname-allow') {
      await client.db.hostnames.updateOne({ _id: new ObjectId(data) }, { $set: { status: HostnameStatus.Allowed } });
      interaction.reply({ content: 'This link has been successfully allowed', ephemeral: true });
    } else if (action === 'hostname-deny') {
      await client.db.hostnames.updateOne({ _id: new ObjectId(data) }, { $set: { status: HostnameStatus.Denied } });
      interaction.reply({ content: 'This link has been successfully denied', ephemeral: true });
    }if (action === 'user-report-resolve') {
      interaction.reply({ content: 'This report resolved' });
    }
    await interaction.message.delete().catch(() => null);
    return;
  }
};
