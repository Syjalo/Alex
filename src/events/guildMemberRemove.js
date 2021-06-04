const usersSchema = require('../schemas/users-schema')

module.exports = {
  name: 'guildMemberRemove',
  execute(member, client) {
    const saveMemberRoles = async () => {
      await client.mongo().then(async (mongoose) => {
        try {
          const response = await usersSchema.findOne({
            id: member.id,
          })
          let guilds = response?.guilds || {}
          if(!guilds[member.guild.id]) guilds[member.guild.id] = {}
          guilds[member.guild.id].roles = member.roles.cache.filter(r => r.name !== '@everyone').keyArray()
          if(!guilds[member.guild.id]?.roles?.length) return
          await usersSchema.findOneAndUpdate(
            {
              id: member.id,
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
    }
    saveMemberRoles()
  }
}
