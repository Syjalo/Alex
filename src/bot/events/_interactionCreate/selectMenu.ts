import { SelectMenuInteraction } from 'discord.js';
import { GetString } from '../../types';
import { Ids } from '../../util/Constants';

export const selectMenu = async (interaction: SelectMenuInteraction<'cached'>, getString: GetString) => {
  if (interaction.customId === 'language-role') {
    await interaction.deferReply({ ephemeral: true });

    const languageRoles = [Ids.roles.english, Ids.roles.otherLanguages],
      rolesToAdd = languageRoles.filter((roleId) => interaction.values.includes(roleId)),
      rolesToRemove = languageRoles.filter((roleId) => !interaction.values.includes(roleId));

    await interaction.member.roles.add(rolesToAdd);
    await interaction.member.roles.remove(rolesToRemove);

    await interaction.editReply({
      content: getString('languageRolesUpdated', {
        variables: {
          count: rolesToAdd.length,
          roles: rolesToAdd.map((value) => `<@&${value}>`).join(', '),
        },
      }),
    });

    if (interaction.values.includes(Ids.roles.russian)) {
      await interaction.followUp({
        content: 'Вот ссылка на русский сервер: https://discord.gg/UFZrUJXKRG',
        ephemeral: true,
      });
    }
  }
};
