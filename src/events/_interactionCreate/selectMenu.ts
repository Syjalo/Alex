import { SelectMenuInteraction } from 'discord.js';
import { GetString } from '../../types';
import { ids } from '../../util/Constants';

export default async (interaction: SelectMenuInteraction<'cached'>, getString: GetString) => {
  if (interaction.customId === 'language-role') {
    const languageRoles = [ids.roles.english, ids.roles.russian, ids.roles.otherLanguages],
      rolesToRemove = languageRoles.filter((roleId) => !interaction.values.includes(roleId));

    await interaction.member.roles.add(interaction.values);
    await interaction.member.roles.remove(rolesToRemove);

    interaction.reply({
      content: getString('languageRolesUpdated', {
        variables: { count: interaction.values.length, roles: interaction.values.map((value) => `<@&${value}>`).join(', ') },
      }),
      ephemeral: true,
    });
  }
};
