import {
  ChatInputCommandInteraction,
  Collection,
  Colors,
  Formatters,
  GuildMember,
  InteractionReplyOptions,
  PermissionFlagsBits,
  Snowflake,
  TextChannel,
  UnsafeEmbedBuilder as Embed,
} from 'discord.js';
import { setTimeout } from 'timers';
import { inspect } from 'util';
import { GetString } from '../../types';
import { AlexBotClient } from '../../util/AlexBotClient';
import { Ids } from '../../util/Constants';
import { Util } from '../../util/Util';

const cooldowns = new Collection<string, Collection<Snowflake, number>>();

export const chatInputCommand = async (
  interaction: ChatInputCommandInteraction<'cached'>,
  client: AlexBotClient,
  getString: GetString,
) => {
  const { commandName } = interaction,
    command = client.commands.get(commandName);
  if (!command) {
    const embed = new Embed()
      .setTitle('An unexpected chat input command interaction')
      .setFields({
        name: 'Command name',
        value: commandName,
      })
      .setColor(Colors.Red);
    await (client.channels.resolve(Ids.channels.botLog) as TextChannel).send({
      content: `<@${Ids.developer}>`,
      embeds: [embed],
    });
    return;
  }

  if (command.dev && interaction.user.id !== Ids.developer) {
    const embed = new Embed().setTitle(getString('underDevelopment', { fileName: 'errors' })).setColor(Colors.Red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
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
            variables: {
              timestamp: Formatters.time(Math.floor(cooldownUntil / 1000), 'R'),
              command: `/${commandName}`,
            },
          }),
        )
        .setColor(Colors.Red);
      await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
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
    const reply = (options: InteractionReplyOptions) =>
      interaction.replied || interaction.deferred ? interaction.followUp(options) : interaction.reply(options);
    if (typeof error === 'string') return await reply({ embeds: [Util.makeErrorEmbed(error, getString)] });

    const embed = new Embed()
      .setTitle(`An unexpected error occurred while running a command`)
      .setFields(
        {
          name: 'Command name',
          value: commandName,
        },
        {
          name: 'Error',
          value: Formatters.codeBlock(inspect(error).substring(0, 1017)),
        },
      )
      .setColor(Colors.Red);
    await (client.channels.resolve(Ids.channels.botLog) as TextChannel).send({
      content: `<@${Ids.developer}>`,
      embeds: [embed],
    });

    const content = getString('unexpectedError', { fileName: 'errors' });
    await reply({ content, ephemeral: true });
  }
};
