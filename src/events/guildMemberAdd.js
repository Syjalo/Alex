const usersSchema = require('../schemas/users-schema')

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    const wMsg = client.welcomeMessages.get(member.guild.id)
    if(wMsg) {
      const channel = client.channels.resolve(wMsg.channelId)
      if(channel) channel.send(wMsg.message.replace(/%memberMention%/g, member.toString()).replace(/%guildName%/g, member.guild.name).replace(/%guildMemberCount%/g, member.guild.memberCount))
    }

    let response
    await client.mongo().then(async (mongoose) => {
      try {
        response = await usersSchema.findOne({
          userId: member.id,
        })
      } finally {
        mongoose.connection.close()
      }
      if(!response?.guilds[member.guild.id]?.roles) return
      const roles = client.guilds.cache.get(member.guild.id).roles.cache.filter((r) => response?.guilds[member.guild.id]?.roles.includes(r.id))
      member.roles.add(roles)
    })
  })
}
