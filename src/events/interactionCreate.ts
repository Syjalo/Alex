import { setTimeout } from 'node:timers';
import { Collection, GuildMember, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import IntlMessageFormat from 'intl-messageformat';
import { GetStringOptions } from '../types';
import { AlexClient } from '../util/AlexClient';
import { Ids } from '../util/Constants';
import { Util } from '../util/Util';

export default (client: AlexClient) => {
  const cooldowns = new Collection<string, Collection<Snowflake, number>>();
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      const command = client.commands.get(commandName);
      if (!command) {
        console.log(`Failed to get ${commandName} command`);
        return;
      }

      const getString = (key: string, options: GetStringOptions = {}) => {
        let { fileName = commandName, locale, variables } = options;
        locale = Util.resolveLocale(locale);
        let enStrings = require(`../../strings/en-US/${fileName}`);
        let strings: Record<string, any>;
        try {
          strings = require(`../../strings/${locale}/${fileName}`);
        } catch {
          strings = require(`../../strings/en-US/${fileName}`);
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

        if (variables && typeof strings === 'string') {
          try {
            string = new IntlMessageFormat(string, locale, undefined, { ignoreTag: true }).format(variables);
          } catch (err) {
            const embed = new MessageEmbed()
              .setTitle('There is a string with unexpected variables here')
              .setDescription(`${err}\nLocale: \`${locale}\` File: \`${fileName}\` Key: \`${key}\``)
              .setColor('RED');
            (client.channels.resolve(Ids.channels.botLog) as TextChannel).send({
              content: `<@${Ids.users.syjalo}>`,
              embeds: [embed],
            });
          }
        }

        return string;
      };

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
                variables: { timestamp: Math.floor(cooldownUntil / 1000), command: `/${commandName}` },
              }),
            )
            .setColor('RED');
          interaction.reply({ embeds: [cooldownEmbed] });
          return;
        }
      }

      if ((interaction.member as GuildMember)!.permissions.has('KICK_MEMBERS')) {
        commandCooldowns.set(interaction.user.id, now + cooldownAmount);
        setTimeout(() => commandCooldowns.delete(interaction.user.id), cooldownAmount);
      }

      try {
        await command.listener(interaction, client, getString);
      } catch (error) {
        if (error.stack) {
          console.log(error);
          const unexpectedErrorEmbed = new MessageEmbed()
            .setTitle(getString('unexpectedError', { fileName: 'errors', variables: { error: `${error.stack}` } }))
            .setColor('RED');
          interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
        } else {
          const errorEmbed = new MessageEmbed().setTitle(getString(error, { fileName: 'errors' })).setColor('RED');
          interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      }
    }
  });
};