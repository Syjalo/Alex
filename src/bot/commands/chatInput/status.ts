import { SlashCommandBuilder } from '@discordjs/builders';
import { ColorResolvable, Colors, UnsafeEmbed as Embed } from 'discord.js';
import { AlexBotChatInputCommand } from '../../types';
import { Util } from '../../util/Util';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder().setName('status').setDescription('Gives the bot status'),
  listener: async (interaction, client, getString) => {
    const firstTimestamp = Date.now();
    await interaction.deferReply();
    const ping = Date.now() - firstTimestamp,
      wsPing = client.ws.ping;

    let color: ColorResolvable;
    if (ping >= 0 && ping < 250) color = Colors.Green;
    else if (ping < 500) color = Colors.Yellow;
    else color = Colors.Red;

    const embed = new Embed()
      .setTitle(getString('embed.title'))
      .setFields(
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
    await interaction.editReply({ embeds: [embed] });
  },
};
