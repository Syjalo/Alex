import { database } from '../../database';
import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'guildMemberUpdate'> = {
  name: 'guildMemberUpdate',
  listener: async (_, oldMember, newMember) => {
    let rolesAdded = false;
    if (oldMember.pending && !newMember.pending) {
      const dbMember = await database.members.findOne({ id: newMember.id, guildId: newMember.guild.id });
      if (dbMember?.savedRoles) {
        await newMember.roles.add(dbMember.savedRoles);
        rolesAdded = true;
      }
    }
    const dbGuild = await database.guilds.findOne({ id: newMember.guild.id });

    if (!rolesAdded) {
      const rolesToSave = [
        ...newMember.roles.cache.filter((role) => dbGuild!.roleIdsToSave.includes(role.id)).values(),
      ].map((role) => role.id);
      if (rolesToSave.length > 0)
        await database.members.findOneAndUpdate(
          { id: newMember.id, guildId: newMember.guild.id },
          { $set: { savedRoles: rolesToSave } },
          { upsert: true },
        );
    }
  },
};
