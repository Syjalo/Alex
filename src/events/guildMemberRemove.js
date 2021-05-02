const usersSchema = require('../schemas/users-schema')

module.exports = (client) => {
  client.on('guildMemberRemove', async (member) => {
    await client.mongo().then(async (mongoose) => {
      try {
        const response = await usersSchema.findOne({
          userId: member.id,
        })
        let guilds = response?.guilds || {}
        if(!guilds[member.guild.id]) guilds[member.guild.id] = {}
        guilds[member.guild.id].roles = member.roles.cache.keyArray()
        await usersSchema.findOneAndUpdate(
          {
            userId: member.id,
          },
          {
            guilds,
          },
          {
            upsert: true,
          }
        )
      } finally {
        mongoose.connection.close()
      }
    })
  })
}
