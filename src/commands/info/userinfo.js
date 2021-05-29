const Discord = require('discord.js')

module.exports = {
  name: 'userinfo',
  aliases: ['memberinfo', 'uinfo', 'minfo'],
  async execute(message, args, client) {
    const failedToFind = []
    for(let i = 0; i < args.length; i++) {
      const userId = args[i].replace(/[<@!>\\]/g, '')
      const member = message.guild.members.resolve(userId)
      if(!member) {
        let user
        try {
          user = await client.users.fetch(userId)
        } catch {
          failedToFind.push(userId)
          continue
        }
        const embed = new Discord.MessageEmbed()
        .setAuthor(user.tag)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(user)
        .addFields(
          { name: client.getString('userinfo.id', message), value: user.id },
          { name: client.getString('userinfo.joinedDiscord', message), value: user.createdAt.toLocaleString(client.getString('global.dateLocale', message), { day: 'numeric', month: 'long', year: 'numeric' }) },
        )
        .setColor(client.constants.defaultRoleColor)
        message.channel.send(embed)
      } else {
        const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(member)
        .addFields(
          { name: client.getString('userinfo.id', message), value: member.user.id },
          { name: client.getString('userinfo.joinedDiscord', message), value: member.user.createdAt.toLocaleString(client.getString('global.dateLocale', message), { day: 'numeric', month: 'long', year: 'numeric' }) },
          { name: client.getString('userinfo.joinedServer', message), value: member.joinedAt.toLocaleString(client.getString('global.dateLocale', message), { day: 'numeric', month: 'long', year: 'numeric' }) },
          { name: client.getString('userinfo.serverBooster', message), value: `${member.premiumSince ? client.getString('userinfo.boosterSince', { data: member.premiumSince.toLocaleString(client.getString('global.dateLocale', message), { day: 'numeric', month: 'long', year: 'numeric' }) }, message) : client.getString('userinfo.notBooster', message)}` },
          { name: client.getString('userinfo.roles', message), value: `(${member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length}) ${(() => member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).join(', '))()}` },
        )
        .setColor(member.displayColor || client.constants.defaultRoleColor)
        message.channel.send(embed)
      }
    }
    if(failedToFind.length > 0) {
      const embed = new Discord.MessageEmbed()
      .setTitle(failedToFind.length > 1 ? client.getString('userinfo.failedToFindMany', message) : client.getString('userinfo.failedToFindOne', message))
      .setDescription(`\`${failedToFind.join('`, `')}\``)
      .setColor(client.constants.redColor)
      message.channel.send(embed)
    }
  }
}