import discord, { Colors, Formatters, SlashCommandBuilder, UnsafeEmbedBuilder as Embed } from 'discord.js';
import { inspect } from 'node:util';
import { format } from 'prettier';
import { getParsedCommandLineOfConfigFile, sys, transpile } from 'typescript';
import { AlexBotChatInputCommand } from '../../types';
import { Ids } from '../../util/Constants';

export const command: AlexBotChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evals provided code')
    .setDefaultMemberPermissions('0')
    .setDMPermission(false)
    .addStringOption((option) => option.setName('code').setDescription('Code to eval').setRequired(true))
    .addBooleanOption((option) => option.setName('ephemeral').setDescription('Whether the reply should be ephemeral')),
  listener: async (interaction) => {
    // 2FA
    if (interaction.user.id !== Ids.developer) return;

    const ephemeral = !!interaction.options.getBoolean('ephemeral'),
      Discord = discord,
      Constants = require('../../util/Constants');

    await interaction.deferReply({ ephemeral });

    let codeToEval = interaction.options.getString('code', true);
    const prettierOptions = { ...require('../../../../.prettierrc.json'), printWidth: 55 };
    codeToEval = format(codeToEval.includes('await ') ? `(async () => {\n${codeToEval}\n})()` : codeToEval, {
      ...prettierOptions,
      parser: 'typescript',
    });

    const { options } = getParsedCommandLineOfConfigFile(
      'tsconfig.json',
      {},
      {
        ...sys,
        onUnRecoverableConfigFileDiagnostic: console.error,
      },
    )!;
    options.sourceMap = false;
    const compiledCode = format(transpile(codeToEval, options), { ...prettierOptions, parser: 'babel' }),
      baseFields = [
        {
          name: 'Input code',
          value: Formatters.codeBlock('ts', codeToEval.substring(0, 1015)),
        },
        {
          name: 'Compiled code',
          value: Formatters.codeBlock('js', compiledCode.substring(0, 1015)),
        },
      ];

    try {
      const firstTimestamp = Date.now(),
        evaledCode = await eval(compiledCode),
        timeSpent = `${(Date.now() - firstTimestamp).toLocaleString()}ms`,
        inspectedReturn = inspect(evaledCode, { getters: true }),
        embed = new Embed()
          .setTitle('The code was evaled successfully')
          .setFields([
            ...baseFields,
            {
              name: 'Eval result',
              value: Formatters.codeBlock('js', inspectedReturn.substring(0, 1015)),
            },
            {
              name: 'Time spent',
              value: timeSpent,
            },
          ])
          .setColor(Colors.Green);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = new Embed()
        .setTitle('An error occured while evaling provided code')
        .setFields([
          ...baseFields,
          {
            name: 'Error',
            value: Formatters.codeBlock((error.stack ?? inspect(error)).substring(0, 1017)),
          },
        ])
        .setColor(Colors.Red);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
