import { SelectMenuComponent, SelectMenuInteraction } from 'discord.js';
import { GetString } from '../../types';

export const selectMenu = async (interaction: SelectMenuInteraction<'cached'>, getString: GetString) => {
  if (interaction.customId === 'select-menu') {
    await interaction.deferReply({ ephemeral: true });

    const selectMenu = interaction.message.components[0].components[0] as SelectMenuComponent;
    const roles = selectMenu.options
        .filter((option) => option.value.startsWith('role-add'))
        .map((option) => option.value.split(':')[1]),
      rolesToAdd = roles.filter((roleId) => interaction.values.includes(`role-add:${roleId}`)),
      rolesToRemove = roles.filter((roleId) => !interaction.values.includes(`role-add:${roleId}`));

    await interaction.member.roles.add(rolesToAdd);
    await interaction.member.roles.remove(rolesToRemove);

    await interaction.editReply({
      content: getString('rolesUpdated', {
        variables: {
          count: rolesToAdd.length,
          roles: rolesToAdd.map((value) => `<@&${value}>`).join(', '),
        },
      }),
    });

    const strings = interaction.values
      .filter((value) => value.startsWith('string'))
      .map((value) => value.split(':')[1]);

    for (const string of strings) {
      if (string === 'russian-server') {
        await interaction.followUp({
          content: 'Вот ссылка на русский сервер: https://discord.gg/UFZrUJXKRG',
          ephemeral: true,
        });
      }
    }
  }
};
