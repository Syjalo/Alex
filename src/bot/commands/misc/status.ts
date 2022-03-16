import { Colors, UnsafeEmbed as Embed } from 'discord.js';
import { Command } from '../../types';
import { Util } from '../../util/Util';

const command: Command = {
  name: 'status',
  description: 'Gives the bot status',
  async listener(interaction, client, getString) {
    const firstTimestamp = Date.now();
    await interaction.deferReply();
    const ping = Date.now() - firstTimestamp,
      wsPing = client.ws.ping;
    let color: number;
    if (ping > 0 && ping < 250) color = Colors.Green;
    else if (ping < 500) color = Colors.Yellow;
    else color = Colors.Red;
    const embed = new Embed()
      .setTitle(getString('embed.title'))
      .addFields(
        {
          name: getString('embed.field.ping.name'),
          value: getString('embed.field.ping.value', { variables: { ms: ping } }),
        },
        {
          name: getString('embed.field.wsPing.name'),
          value: getString('embed.field.wsPing.value', { variables: { ms: wsPing } }),
        },
        {
          name: getString('embed.field.onlineSince.name'),
          value: Util.makeFormattedTime(Math.floor(client.readyTimestamp / 1000)),
        },
      )
      .setColor(color);
    interaction.editReply({ embeds: [embed] });
  },
};

export default command;
