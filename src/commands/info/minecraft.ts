import axios from 'axios';
import {
  Message,
  ActionRow,
  ButtonComponent,
  UnsafeEmbed as Embed,
  ApplicationCommandOptionType,
  ButtonStyle,
  Colors,
  ComponentType,
} from 'discord.js';
import { Command, NameHistory } from '../../types';
import { Util } from '../../util/Util';

const command: Command = {
  name: 'minecraft',
  description: 'Gives information about Minecraft player',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'player',
      description: "Player's UUID or username to give information about",
      required: true,
    },
  ],
  async listener(interaction, _, getString) {
    const player = interaction.options.getString('player', true);
    let uuid: string | undefined;

    if (player.length < 32)
      uuid = await axios
        .get(`https://api.mojang.com/users/profiles/minecraft/${player}`)
        .then((res) => res.data.id)
        .catch(() => null);
    else uuid = player;
    const isValidUUID = await axios
      .get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
      .then((res) => !!res.data.id)
      .catch(() => null);
    if (!(uuid && isValidUUID)) throw 'playerNotFound';

    const names = await axios
        .get<NameHistory[]>(`https://api.mojang.com/user/profiles/${uuid}/names`)
        .then((res) => res.data),
      username = names[names.length - 1].name;
    names.forEach((n) => {
      n.name = n.name.replaceAll('_', '\\_');
      n.name = `${names.indexOf(n) + 1}. ${n.name}`;
    });
    names.reverse();
    const pages: NameHistory[][] = [];
    do {
      pages.push(names.splice(0, 10));
    } while (names.length);
    const lastPage = pages.length - 1,
      buttons = new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId('first')
          .setLabel(getString('buttons.first', { fileName: 'global' }))
          .setEmoji({ name: '⏮️' })
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId('previous')
          .setLabel(getString('buttons.previous', { fileName: 'global' }))
          .setEmoji({ name: '◀️' })
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId('next')
          .setLabel(getString('buttons.next', { fileName: 'global' }))
          .setEmoji({ name: '▶️' })
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId('last')
          .setLabel(getString('buttons.last', { fileName: 'global' }))
          .setEmoji({ name: '⏭️' })
          .setStyle(ButtonStyle.Primary),
      );
    let page = 0,
      embeds!: Embed[],
      components!: ActionRow[];

    const updateData = () => {
      embeds = [
        new Embed()
          .setTitle(getString('embed.title', { variables: { username } }))
          .addFields(
            ...pages[page].map((page) => ({
              name: page.name,
              value: page.changedToAt
                ? Util.makeFormattedTime(Math.floor(page.changedToAt / 1000))
                : getString<string>('embed.field.name.values.unknown'),
            })),
          )
          .setThumbnail(`https://mc-heads.net/body/${uuid}/4096/left`)
          .setColor(Colors.Green),
      ];

      if (pages.length !== 1) {
        if (page === 0)
          buttons.components.forEach((btn) => btn.setDisabled(['first', 'previous'].includes(btn.customId!)));
        else if (page === lastPage)
          buttons.components.forEach((btn) => btn.setDisabled(['next', 'last'].includes(btn.customId!)));
        else buttons.components.forEach((btn) => btn.setDisabled(false));
        components = [buttons];
      }
    };

    updateData();
    await interaction.reply({ embeds, components });
    if (pages.length === 1) return;
    const message = await interaction.fetchReply(),
      buttonsCollector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        idle: 1000 * 60 * 2,
      });

    buttonsCollector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.isButton()) {
        if (interaction.user.id !== buttonInteraction.user.id) {
          const errorEmbed = Util.makeErrorEmbed('notForYou', getString);
          buttonInteraction.reply({ embeds: [errorEmbed], ephemeral: true });
          return;
        } else if (buttonInteraction.customId === 'first') page = 0;
        else if (buttonInteraction.customId === 'previous' && --page < 0) page = 0;
        else if (buttonInteraction.customId === 'next' && ++page > lastPage) page = lastPage;
        else if (buttonInteraction.customId === 'last') page = lastPage;
        updateData();
        await buttonInteraction.update({ embeds, components });
      }
    });

    buttonsCollector.on('end', () => {
      buttons.components.forEach((btn) => btn.setDisabled(true));
      interaction.editReply({ embeds, components });
    });
  },
};

export default command;
