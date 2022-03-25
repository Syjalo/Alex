import { SlashCommandBuilder } from '@discordjs/builders';
import { AlexBotChatInputCommand } from '../../types';
import { reset } from './_language/reset';
import { set } from './_language/set';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Manages your language')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Sets your language')
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription('Language to set your language to')
            .setAutocomplete(true)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) => subcommand.setName('reset').setDescription('Resets your language')),
  listener: async (interaction, client, getString) => {
    const subcommand = interaction.options.getSubcommand(true);
    if (subcommand === 'reset') reset(interaction, getString);
    else if (subcommand === 'set') set(interaction, getString);
  },
};
