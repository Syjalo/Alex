import { UnsafeEmbed as Embed } from '@discordjs/builders';
import { ApplicationCommandOptionType, Colors, TextChannel } from 'discord.js';
import { Command } from '../../types';
import { ids } from '../../util/Constants';
import { Util } from '../../util/Util';

const command: Command = {
  name: 'report',
  description: 'Makes user report',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'User to report',
      required: true,
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'Reason of report',
      required: true,
    },
    {
      name: 'proof',
      type: ApplicationCommandOptionType.Attachment,
      description: 'Proof for report',
    },
  ],
  async listener(interaction, client, getString) {
    const user = interaction.options.getUser('user', true),
      reason = interaction.options.getString('reason', true),
      proof = interaction.options.getAttachment('proof');

    const embed = new Embed()
      .setAuthor({
        iconURL: interaction.member.displayAvatarURL(),
        name: interaction.member.displayName,
        url: Util.makeUserURL(interaction.user.id),
      })
      .setTitle('New user report')
      .setFields(
        {
          name: 'User',
          value: `${user}`,
        },
        {
          name: 'Reason',
          value: reason,
        },
      )
      .setColor(Colors.Red);

    await (client.channels.resolve(ids.channels.reports) as TextChannel).send({
      embeds: [embed],
      attachments: proof ? [proof] : undefined,
    });
    interaction.reply({ content: getString('sent') });
  },
};

export default command;
