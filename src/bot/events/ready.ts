import {
  ApplicationCommandPermissionData,
  ApplicationCommandPermissionType,
  Colors,
  TextChannel,
  UnsafeEmbed as Embed,
} from 'discord.js';
import { AlexBotClientEvent } from '../types';
import { Ids } from '../util/Constants';

export const event: AlexBotClientEvent<'ready'> = {
  name: 'ready',
  once: true,
  listener: async (client) => {
    if (process.env.NODE_ENV === 'production') {
      const embed = new Embed().setTitle('Ready').setColor(Colors.Green);
      await (client.channels.resolve(Ids.channels.botLog) as TextChannel).send({ embeds: [embed] });
    }

    const guild = client.guilds.resolve(Ids.guilds.main)!;
    await guild.commands.set([...client.commands.values()]);
    for (const applicationCommand of guild.commands.cache.values()) {
      const command = client.commands.get(applicationCommand.name);
      if (!(command?.allowedRoles || command?.allowedUsers)) {
        await applicationCommand.permissions.set({ permissions: [] });
        continue;
      }

      const permissions: ApplicationCommandPermissionData[] = [];
      if (command.allowedRoles)
        permissions.push(
          ...command.allowedRoles.map((id) => ({ id, type: ApplicationCommandPermissionType.Role, permission: true })),
        );
      if (command.allowedUsers)
        permissions.push(
          ...command.allowedUsers.map((id) => ({ id, type: ApplicationCommandPermissionType.User, permission: true })),
        );
      await applicationCommand.permissions.set({ permissions });
    }
  },
};
