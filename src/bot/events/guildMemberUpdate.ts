import { database } from '../../database';
import { AlexBotClientEvent } from '../types';
import { RolesToSave } from '../util/Constants';

export const event: AlexBotClientEvent<'guildMemberUpdate'> = {
  name: 'guildMemberUpdate',
  listener: async (_, oldMember, newMember) => {
    if (oldMember.pending && !newMember.pending) {
      const dbUser = await database.users.findOne({ id: newMember.id });
      if (dbUser?.savedRoles) {
        await newMember.roles.add(dbUser.savedRoles);
        await database.users.findOneAndUpdate({ id: newMember.id }, { $unset: { savedRoles: true } });
      }
    }

    const rolesToSave = [...newMember.roles.cache.filter((role) => RolesToSave.includes(role.id)).values()].map(
      (role) => role.id,
    );
    if (rolesToSave.length > 0)
      await database.users.findOneAndUpdate(
        { id: newMember.id },
        { $set: { savedRoles: rolesToSave } },
        { upsert: true },
      );
  },
};
