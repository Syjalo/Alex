import { ButtonInteraction, Message } from 'discord.js';
import { DBHostname } from '../../types';
import { AlexClient } from '../../util/AlexClient';

export default async (interaction: ButtonInteraction<'cached'>, client: AlexClient) => {
  const [action, data] = interaction.customId.split(':');
  if (action.startsWith('hostname')) {
    if (action === 'hostname-allow') {
      await client.db.collection<DBHostname>('hostnamesWhitelist').insertOne({ hostname: data }),
        interaction.reply({ content: 'This link has been successfully added to the whitelist', ephemeral: true });
    } else if (action === 'hostname-deny') {
      await client.db.collection<DBHostname>('hostnamesBlacklist').insertOne({ hostname: data }),
        interaction.reply({ content: 'This link has been successfully added to the blacklist', ephemeral: true });
    }
    interaction.message.delete();
    return;
  }
};
