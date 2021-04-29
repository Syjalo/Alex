const userSchema = require('../schemas/user-schema');

module.exports = (client) => {
	client.on('guildMemberAdd', async (member) => {
		let response;
		await client.mongo().then(async (mongoose) => {
			try {
				response = await userSchema.findOne({
					guildId: member.guild.id,
					userId: member.id,
				});
			} finally {
				mongoose.connection.close();
      }
      const roles = client.guilds.cache.get(response.guildId).roles.cache.filter(r => response.roles.includes(r.id))
      member.roles.add(roles)
		});
	});
};
