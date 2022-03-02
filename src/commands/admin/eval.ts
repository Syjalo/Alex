import { inspect } from 'node:util';
import discord, { ApplicationCommandOptionType, Colors, Formatters, UnsafeEmbed as Embed } from 'discord.js';
import { format } from 'prettier';
import { transpile, getParsedCommandLineOfConfigFile, sys } from 'typescript';
import { Command } from '../../types';
import { ids } from '../../util/Constants';

const command: Command = {
  name: 'eval',
  description: 'Evals provided code',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'code',
      description: 'Code to eval',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      name: 'ephemeral',
      description: 'Whether the reply should be ephemeral',
    },
  ],
  allowedUsers: [ids.users.syjalo],
  async listener(interaction, client, getString) {
    const ephemeral = !!interaction.options.getBoolean('ephemeral'),
      Discord = discord;
    await interaction.deferReply({ ephemeral });
    let codeToEval = interaction.options.getString('code', true);
    if (codeToEval.includes('await')) codeToEval = `(async () => {\n${codeToEval}\n})()`;
    const prettierOptions = require('../../../.prettierrc.json');
    codeToEval = format(codeToEval, { ...prettierOptions, parser: 'typescript', printWidth: 55 })

    const { options } = getParsedCommandLineOfConfigFile(
      'tsconfig.json',
      {},
      {
        ...sys,
        onUnRecoverableConfigFileDiagnostic: console.error,
      },
    )!;
    options.sourceMap = false;
    const compiledCode = format(transpile(codeToEval, options), { ...prettierOptions, parser: 'babel', printWidth: 55 }),
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
          .setFields(
            ...baseFields,
            {
              name: 'Eval result',
              value: Formatters.codeBlock('js', inspectedReturn.substring(0, 1015)),
            },
            {
              name: 'Time spent',
              value: timeSpent,
            },
          )
          .setColor(Colors.Green);
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = new Embed()
        .setTitle('An error occured while evaling provided code')
        .setFields(...baseFields, {
          name: 'Error',
          value: Formatters.codeBlock((error.stack ?? inspect(error)).substring(0, 1017)),
        })
        .setColor(Colors.Red);
      interaction.editReply({ embeds: [embed] });
    }
  },
};

export default command;
