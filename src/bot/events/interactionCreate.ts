import { ChatInputCommandInteraction } from 'discord.js';
import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { Util } from '../util/Util';
import { autocomplete } from './_interactionCreate/autocomplete';
import { button } from './_interactionCreate/button';
import { chatInputCommand } from './_interactionCreate/chatInputCommand';
import { selectMenu } from './_interactionCreate/selectMenu';

export const event: AlexBotClientEvent<'interactionCreate'> = {
  name: 'interactionCreate',
  listener: async (client, interaction) => {
    if (!interaction.inCachedGuild()) return;

    const dbUser = await database.members.findOne({ id: interaction.user.id, guildId: interaction.guildId }),
      getString = Util.makeGetStringFunction({
        defaultFileName: (interaction as ChatInputCommandInteraction<'cached'>).commandName,
        defaultLocale: dbUser?.locale || interaction.locale,
      });

    if (interaction.isAutocomplete()) autocomplete(interaction);
    else if (interaction.isButton()) button(interaction);
    else if (interaction.isChatInputCommand()) chatInputCommand(interaction, client, getString);
    else if (interaction.isSelectMenu()) selectMenu(interaction, getString);
  },
};
