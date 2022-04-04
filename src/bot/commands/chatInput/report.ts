import { ActionRowBuilder, SlashCommandBuilder, UnsafeButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, Colors, ComponentType, EmbedBuilder as Embed, TextChannel } from 'discord.js';
import { AlexBotChatInputCommand } from '../../types';
import { Ids } from '../../util/Constants';
import { Util } from '../../util/Util';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Makes user report')
    .addUserOption((option) => option.setName('user').setDescription('User to report').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason of report').setRequired(true))
    .addAttachmentOption((option) => option.setName('proof').setDescription('Proof for report. Must be image or gif')),
  listener: async (interaction, client, getString) => {
    const user = interaction.options.getUser('user', true),
      member = await interaction.guild.members.fetch(user).catch(() => null),
      reason = interaction.options.getString('reason', true),
      proof = interaction.options.getAttachment('proof');

    const embed = new Embed()
      .setTitle(getString('doYouWantEmbed.title', { variables: { user: member?.displayName || user.username } }))
      .setFields({
        name: getString('doYouWantEmbed.fields.reason.name'),
        value: reason,
      })
      .setColor(Colors.LightGrey);
    const buttons = new ActionRowBuilder<UnsafeButtonBuilder>().addComponents(
      new UnsafeButtonBuilder()
        .setCustomId('yes')
        .setLabel(getString('buttons.yes', { fileName: 'global' }))
        .setStyle(ButtonStyle.Success),
      new UnsafeButtonBuilder()
        .setCustomId('no')
        .setLabel(getString('buttons.no', { fileName: 'global' }))
        .setStyle(ButtonStyle.Danger),
    );
    const message = await interaction.reply({
      embeds: [embed],
      components: [buttons],
      ephemeral: true,
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      time: 60_000,
      max: 1,
      componentType: ComponentType.Button,
    });

    collector.once('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'yes') {
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
        if (proof && proof.contentType?.startsWith('image')) embed.setImage(proof.url);
        const buttons = new ActionRowBuilder<UnsafeButtonBuilder>().addComponents(
          new UnsafeButtonBuilder()
            .setCustomId('user-report-resolve')
            .setLabel('Resolve')
            .setStyle(ButtonStyle.Success),
        );
        await (client.channels.resolve(Ids.channels.report) as TextChannel).send({ embeds: [embed] });
        await buttonInteraction.update({ content: getString('sent'), embeds: [], components: [] });
      } else if (buttonInteraction.customId === 'no')
        await buttonInteraction.update({ content: getString('canceled'), embeds: [], components: [] });
    });

    collector.once('end', async (collected) => {
      if (collected.size < 1)
        await interaction.editReply({ content: getString('timeout'), embeds: [], components: [] });
    });
  },
};
