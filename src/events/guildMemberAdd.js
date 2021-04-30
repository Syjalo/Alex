const usersSchema = require('../schemas/users-schema');

module.exports = (client) => {
	client.on('guildMemberAdd', async (member) => {
		let response;
		await client.mongo().then(async (mongoose) => {
			try {
				response = await usersSchema.findOne({
					userId: member.id,
				});
			} finally {
				mongoose.connection.close();
			}
			if (!response?.guilds[member.guild.id]?.roles) return;
			const roles = client.guilds.cache
				.get(member.guild.id)
				.roles.cache.filter((r) => response?.guilds[member.guild.id]?.roles.includes(r.id));
			member.roles.add(roles);
		});
	});
};
