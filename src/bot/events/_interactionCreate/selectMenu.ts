import { SelectMenuInteraction } from 'discord.js';
import { GetString } from '../../types';
import { Ids } from '../../util/Constants';

export const selectMenu = async (interaction: SelectMenuInteraction<'cached'>, getString: GetString) => {
  if (interaction.customId === 'language-role') {
    await interaction.deferReply({ ephemeral: true });

    const languageRoles = [Ids.roles.english, Ids.roles.russian, Ids.roles.otherLanguages],
      rolesToRemove = languageRoles.filter((roleId) => !interaction.values.includes(roleId));

    await interaction.member.roles.add(interaction.values);
    await interaction.member.roles.remove(rolesToRemove);

    await interaction.editReply({
      content: getString('languageRolesUpdated', {
        variables: {
          count: interaction.values.length,
          roles: interaction.values.map((value) => `<@&${value}>`).join(', '),
        },
      }),
    });
  }
};
