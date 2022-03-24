import { database } from '../../database';
import { AlexBotClientEvent } from '../types';

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
  },
};
