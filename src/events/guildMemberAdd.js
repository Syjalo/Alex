const usersSchema = require('../schemas/users-schema')
const altDetector = require('../utils/altdetector')

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    altDetector(member)
    let response
    await client.mongo().then(async (mongoose) => {
      try {
        response = await usersSchema.findOne({
          id: member.id,
        })
      } finally {
        mongoose.connection.close()
      }
      if(!response?.guilds[member.guild.id]?.roles) return
      const roles = client.guilds.cache.get(member.guild.id).roles.cache.filter((r) => response?.guilds[member.guild.id]?.roles.includes(r.id))
      member.roles.add(roles)
    })
  }
}
