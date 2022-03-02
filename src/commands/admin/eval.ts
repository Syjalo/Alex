import { inspect } from 'node:util';
import { ApplicationCommandOptionType, Colors, Formatters, UnsafeEmbed as Embed } from 'discord.js';
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
  ],
  allowedUsers: [ids.users.syjalo],
  async listener(interaction, client, getString) {
    await interaction.deferReply();
    let codeToEval = interaction.options.getString('code', true);
    if (codeToEval.includes('await')) codeToEval = `(async () => {\n${codeToEval}\n})()`;

    const { options } = getParsedCommandLineOfConfigFile(
      'tsconfig.json',
      {},
      {
        ...sys,
        onUnRecoverableConfigFileDiagnostic: console.error,
      },
    )!;
    options.sourceMap = false;
    const compiledCode = transpile(codeToEval, options),
      baseFields = [
        {
          name: 'Input code',
          value: Formatters.codeBlock('ts', codeToEval.substring(0, 1015)),
        },
        {
          name: 'Compoied code',
          value: Formatters.codeBlock('js', compiledCode.substring(0, 1015)),
        },
      ];

    try {
      const firstTimestamp = Date.now(),
        evaledCode = eval(compiledCode),
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
