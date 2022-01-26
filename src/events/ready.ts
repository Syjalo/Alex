import { MessageEmbed, TextChannel } from 'discord.js';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.once('ready', async () => {
    await client.guilds.resolve(ids.guilds.main)!.commands.set(client.commands.map((c) => c));
    await client.guilds
      .resolve(ids.guilds.main)!
      .commands.fetch()
      .then((cmds) =>
        cmds.forEach((cmd) => {
          const command = client.commands.get(cmd.name);
          if (command?.allowedRoles) {
            if (cmd.defaultPermission) cmd.setDefaultPermission(false);
            cmd.permissions.set({
              permissions: command.allowedRoles.map((id) => ({
                id,
                type: 'ROLE',
                permission: true,
              })),
            });
          } else if (!cmd.defaultPermission) cmd.setDefaultPermission(true);
        }),
      );
    console.log('Ready!');
    if (!process.env.PRODUCTION) return;
    const readyEmbed = new MessageEmbed().setTitle('Ready!').setColor('GREEN');
    (client.channels.resolve(ids.channels.botLog) as TextChannel).send({ embeds: [readyEmbed] });
  });
};
