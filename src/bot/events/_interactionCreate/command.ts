import { setTimeout } from 'node:timers';
import {
  Collection,
  Colors,
  CommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  UnsafeEmbed as Embed,
} from 'discord.js';
import { AlexClient } from '../../util/AlexClient';
import { ids } from '../../util/Constants';
import { Util } from '../../util/Util';
import { GetString } from '../../types';

const cooldowns = new Collection<string, Collection<string, number>>();

export default async (interaction: CommandInteraction<'cached'>, client: AlexClient, getString: GetString) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) {
    console.log(`Failed to get ${commandName} command`);
    return;
  }

  if (command.dev && interaction.user.id !== ids.users.syjalo) {
    const embed = new Embed().setTitle(getString('underDevelopment', { fileName: 'errors' })).setColor(Colors.Red);
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
      const cooldownEmbed = new Embed()
        .setTitle(
          getString('cooldownExist', {
            fileName: 'errors',
            variables: { timestamp: `<t:${Math.floor(cooldownUntil / 1000)}:R>`, command: `/${commandName}` },
          }),
        )
        .setColor(Colors.Red);
      interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
      return;
    }
  }

  if (!(interaction.member as GuildMember)!.permissions.has(PermissionFlagsBits.KickMembers)) {
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
