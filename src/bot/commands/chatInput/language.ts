import { ApplicationCommandOptionType } from 'discord.js';
import { AlexBotChatInputApplicationCommandData } from '../../types';
import { reset } from './_language/reset';
import { set } from './_language/set';

export const command: AlexBotChatInputApplicationCommandData = {
  name: 'language',
  description: 'Manages your language',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'set',
      description: 'Sets your language',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'language',
          description: 'Language to set your language to',
          autocomplete: true,
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'reset',
      description: 'Resets your language',
    },
  ],
  listener: async (interaction, client, getString) => {
    const subcommand = interaction.options.getSubcommand(true);
    if (subcommand === 'reset') reset(interaction, getString);
    else if (subcommand === 'set') set(interaction, getString);
  },
};
