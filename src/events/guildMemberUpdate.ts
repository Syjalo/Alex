import { AlexClient } from '../util/AlexClient';

export default (client: AlexClient) => {
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.pending === true && newMember.pending === false) {
      const usersCollection = client.db.users,
        dbUser = await usersCollection.findOne({ id: newMember.id });
      if (dbUser?.savedRoles) {
        newMember.roles.add(dbUser.savedRoles);
        usersCollection.findOneAndUpdate({ id: newMember.id }, { $unset: { savedRoles: true } });
      }
    }
  });
};
