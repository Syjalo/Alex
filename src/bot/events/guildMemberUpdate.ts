import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { RolesToSave } from '../util/Constants';

export const event: AlexBotClientEvent<'guildMemberUpdate'> = {
  name: 'guildMemberUpdate',
  listener: async (_, oldMember, newMember) => {
    let rolesAdded = false;
    if (oldMember.pending && !newMember.pending) {
      const dbUser = await database.members.findOne({ id: newMember.id, guildId: newMember.guild.id });
      if (dbUser?.savedRoles) {
        await newMember.roles.add(dbUser.savedRoles);
        rolesAdded = true;
      }
    }

    if (!rolesAdded) {
      const rolesToSave = [...newMember.roles.cache.filter((role) => RolesToSave.includes(role.id)).values()].map(
        (role) => role.id,
      );
      if (rolesToSave.length > 0)
        await database.members.findOneAndUpdate(
          { id: newMember.id, guildId: newMember.guild.id },
          { $set: { savedRoles: rolesToSave } },
          { upsert: true },
        );
    }
  },
};
