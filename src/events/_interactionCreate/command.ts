import { setTimeout } from 'node:timers';
import { Collection, CommandInteraction, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import MessageFormat from '@messageformat/core';
import { DBUser, GetStringOptions, Locales } from '../../types';
import { AlexClient } from '../../util/AlexClient';
import { ids } from '../../util/Constants';
import { Util } from '../../util/Util';

const cooldowns = new Collection<string, Collection<string, number>>();

export default async (interaction: CommandInteraction, client: AlexClient) => {
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) {
    console.log(`Failed to get ${commandName} command`);
    return;
  }

  const dbUser = await client.db.collection<DBUser>('users').findOne({ id: interaction.user.id }),
    getString = (key: string, options: GetStringOptions = {}) => {
      let { fileName = commandName, locale = dbUser?.locale ?? (interaction.locale as Locales), variables } = options;
      locale = Util.resolveLocale(locale);
      let enStrings = require(`../../../strings/en-US/${fileName}`);
      let strings: Record<string, any>;
      try {
        strings = require(`../../../strings/${locale}/${fileName}`);
      } catch {
        strings = require(`../../../strings/en-US/${fileName}`);
      }

      key.split('.').forEach((keyPart) => {
        try {
          enStrings = enStrings[keyPart];
          strings = strings[keyPart];
        } catch {
          strings = enStrings;
        }
      });
      let string: any;
      if (strings) string = strings;
      else string = enStrings;

      if (variables && typeof string === 'string') string = new MessageFormat(locale).compile(string)(variables);

      return string;
    };

  if (command.dev && interaction.user.id !== ids.users.syjalo) {
    const embed = new MessageEmbed().setTitle(getString('underDevelopment', { fileName: 'errors' })).setColor('RED');
    interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  if (!cooldowns.has(commandName)) cooldowns.set(commandName, new Collection());
  const commandCooldowns = cooldowns.get(commandName)!,
    now = Date.now(),
    cooldownAmount = (command.cooldown ?? 3) * 1000;
  if (commandCooldowns.has(interaction.user.id)) {
    const cooldownUntil = commandCooldowns.get(interaction.user.id)!;
    if (now < cooldownUntil) {
      const cooldownEmbed = new MessageEmbed()
        .setTitle(
          getString('cooldownExist', {
            fileName: 'errors',
            variables: { timestamp: `<t:${Math.floor(cooldownUntil / 1000)}:R>`, command: `/${commandName}` },
          }),
        )
        .setColor('RED');
      interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
      return;
    }
  }

  if (!(interaction.member as GuildMember)!.permissions.has('KICK_MEMBERS')) {
    commandCooldowns.set(interaction.user.id, now + cooldownAmount);
    setTimeout(() => commandCooldowns.delete(interaction.user.id), cooldownAmount);
  }

  try {
    await command.listener(interaction, client, getString);
  } catch (error) {
    if (error.stack) console.log(error);
    const errorEmbed = Util.makeErrorEmbed(error, getString);
    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
};
