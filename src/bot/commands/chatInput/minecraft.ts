import { ActionRowBuilder, SlashCommandBuilder, UnsafeButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, Colors, ComponentType, UnsafeEmbedBuilder as Embed } from 'discord.js';
import fetch from 'node-fetch';
import {
  AlexBotChatInputCommand,
  MojangAPINameHistory,
  MojangAPIUsernameToUUID,
  MojangAPIUUIDToNameHistory,
} from '../../types';
import { Util } from '../../util/Util';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Gives information about Minecraft player')
    .addStringOption((option) =>
      option.setName('player').setDescription("Player's UUID or username to give information about").setRequired(true),
    ),
  listener: async (interaction, _, getString) => {
    await interaction.deferReply({ fetchReply: true });

    const player = interaction.options.getString('player', true);
    let uuid: string | null;

    if (player.length < 32) {
      const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`)
        .then((res) => res.json() as Promise<MojangAPIUsernameToUUID>)
        .catch(() => null);
      if (!res) throw 'playerNotFound';
      uuid = res.id;
    }
    uuid ||= player;

    const nameHistory = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`)
      .then((res) => res.json() as Promise<MojangAPIUUIDToNameHistory>)
      .catch(() => null);
    if (!nameHistory) throw 'playerNotFound';

    const username = nameHistory.at(-1)!.name.replace('_', '\\_');
    for (let i = 0; i < nameHistory.length; i++) nameHistory[i].name = `${i + 1}. ${nameHistory[i].name.replace('_', '\\_')}`;
    nameHistory.reverse();

    const pages: MojangAPINameHistory[][] = [[]];
    for (let i = 0; i < nameHistory.length; i++)
      (i + 1) % 10 === 0 ? pages.push([nameHistory[i]]) : pages.at(-1)!.push(nameHistory[i]);

    const makePageEmbed = (pageNameData: MojangAPINameHistory[], pageCount: number, pageIndex: number) => {
      const embed = new Embed()
        .setTitle(getString('embed.title', { variables: { username } }))
        .setFields([
          ...pageNameData.map((nameData) => ({
            name: nameData.name,
            value: nameData.changedToAt
              ? Util.makeFormattedTime(Math.floor(nameData.changedToAt / 1000))
              : getString('embed.field.name.values.unknown'),
          })),
        ])
        .setThumbnail(`https://mc-heads.net/body/${uuid}/4096/left`)
        .setColor(Colors.Green);
      if (pageCount > 1)
        embed.setFooter({
          text: getString('embed.footer.text', { variables: { current: pageIndex + 1, total: pageCount } }),
        });
      return embed;
    };

    const makePageComponents = (pageCount: number, pageIndex: number) => {
      return new ActionRowBuilder<UnsafeButtonBuilder>().addComponents([
        new UnsafeButtonBuilder()
          .setCustomId('first')
          .setLabel(getString('buttons.first', { fileName: 'global' }))
          .setEmoji({ name: '⏮️' })
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex < 0 || pageIndex === 0),
        new UnsafeButtonBuilder()
          .setCustomId(`scroll:${pageIndex - 1}`)
          .setLabel(getString('buttons.previous', { fileName: 'global' }))
          .setEmoji({ name: '◀️' })
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex < 0 || pageIndex === 0),
        new UnsafeButtonBuilder()
          .setCustomId(`scroll:${pageIndex + 1}`)
          .setLabel(getString('buttons.next', { fileName: 'global' }))
          .setEmoji({ name: '▶️' })
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex < 0 || pageIndex === pageCount - 1),
        new UnsafeButtonBuilder()
          .setCustomId('last')
          .setLabel(getString('buttons.last', { fileName: 'global' }))
          .setEmoji({ name: '⏭️' })
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex < 0 || pageIndex === pageCount - 1),
      ]);
    };

    const makeMessageOptions = (pages: MojangAPINameHistory[][], pageIndex: number) => ({
      embeds: [makePageEmbed(pages[pageIndex], pages.length, pageIndex)],
      components: pages.length > 1 ? [makePageComponents(pages.length, pageIndex)] : undefined,
      fetchReply: true,
    });

    const message = await interaction.editReply(makeMessageOptions(pages, 0));

    if (pages.length < 2) return;

    const collector = message.createMessageComponentCollector({ idle: 150000, componentType: ComponentType.Button });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id === interaction.user.id) {
        const [action, pageIndex] = buttonInteraction.customId.split(':');
        switch (action) {
          case 'first':
            await buttonInteraction.update(makeMessageOptions(pages, 0));
            break;
          case 'last':
            await buttonInteraction.update(makeMessageOptions(pages, pages.length - 1));
            break;
          case 'scroll':
            await buttonInteraction.update(makeMessageOptions(pages, +pageIndex));
            break;
        }
      }
    });

    collector.once('end', async () => {
      await interaction.editReply({ components: [makePageComponents(pages.length, -1)] });
    });
  },
};
