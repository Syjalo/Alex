import { ColorResolvable, GuildMember, MessageEmbed } from 'discord.js';
import { Command } from '../../types';

const command: Command = {
  name: 'status',
  description: 'Gives the bot status',
  listener(interaction, client, getString) {
    const { ping } = client.ws;
    let color: ColorResolvable;
    if (ping > 0 && ping < 250) color = 'GREEN';
    else if (ping < 500) color = 'YELLOW';
    else color = 'RED';
    const embed = new MessageEmbed()
      .setTitle(getString('embed.title'))
      .addFields([
        {
          name: getString('embed.field.ping.name'),
          value: getString('embed.field.ping.value'),
        },
      ])
      .setColor(color);
    interaction.reply({ embeds: [embed] });
  },
};

export default command;
