import {
  ActivityType,
  ApplicationCommandPermissionType,
  Colors,
  Snowflake,
  TextChannel,
  UnsafeEmbed as Embed,
} from 'discord.js';
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
                type: ApplicationCommandPermissionType.Role,
                permission: true,
              })),
            });
          } else if (!cmd.defaultPermission) cmd.setDefaultPermission(true);
        }),
      );
    console.log('Ready!');
    if (process.env.NODE_ENV !== 'production') return;
    const readyEmbed = new Embed().setTitle('Ready!').setColor(Colors.Green);
    (client.channels.resolve(ids.channels.botLog) as TextChannel).send({ embeds: [readyEmbed] });

    const setRandomActivity = () => {
      const getMembersDisplayNamesByRoleId = (id: Snowflake) =>
          client.guilds
            .resolve('724163890803638273')!
            .roles.resolve(id)!
            .members.map((member) => member.displayName),
        membersNames = [
          ...new Set([
            ...getMembersDisplayNamesByRoleId('724165923963142224'), // Developers
            ...getMembersDisplayNamesByRoleId('943188711640805376'), // Menagment
            ...getMembersDisplayNamesByRoleId('931064644234268722'), // Moderators
            ...getMembersDisplayNamesByRoleId('893112744197357658'), // Under Hiatus
            ...getMembersDisplayNamesByRoleId('945793405370376202'), // Trial Under Hiatus
            ...getMembersDisplayNamesByRoleId('888455491058036746'), // Helpers
            ...getMembersDisplayNamesByRoleId('846351712368197632'), // Contributors
            ...getMembersDisplayNamesByRoleId('846353111269507132'), // VIP
            ...getMembersDisplayNamesByRoleId('748957661097361530'), // Boosters
          ]).values(),
        ],
        randomName = membersNames[Math.floor(Math.random() * membersNames.length)],
        status = {
          [ActivityType.Playing]: [
            'with {randomName}',
            'Minecraft via PojavLauncher',
            'Minecraft with {randomName}',
            'on 2po2jav with {randomName}',
            'with commands',
          ],
          [ActivityType.Listening]: ['{randomName}', 'slash commands!'],
          [ActivityType.Watching]: ['{randomName}', 'stupid errors'],
        };
      type MyActivityType = keyof typeof status;
      const statuses: [MyActivityType, string][] = [];
      for (const [activityType, activityNames] of Object.entries(status)) {
        for (const activityName of activityNames) {
          statuses.push([Number(activityType), activityName]);
        }
      }

      const [randomActivityType, randonStatus] = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity({ type: randomActivityType, name: randonStatus });
    };
    setRandomActivity();
    setInterval(setRandomActivity, 1000 * 60);
  });
};
