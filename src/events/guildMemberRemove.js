const userSchema = require('../schemas/user-schema');

module.exports = (client) => {
	client.on('guildMemberRemove', async (member) => {
		await client.mongo().then(async (mongoose) => {
			try {
				await userSchema.findOneAndUpdate(
					{
						guildId: member.guild.id,
						userId: member.id,
					},
					{
						roles: member.roles.cache.keyArray(),
					},
					{
						upsert: true,
					}
				);
			} finally {
				mongoose.connection.close();
			}
		});
	});
};
