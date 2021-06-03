const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')

module.exports = {
  name: 'userinfo',
  aliases: ['memberinfo', 'uinfo', 'minfo'],
  async execute(message, args, client) {
    const timeAgo = new TimeAgo(client.languages.get(message.author.id || message.guild.preferredLocale || 'en-US'))
    const failedToFind = []
    if(args.length === 0) args[0] = message.author.id
    for(let i = 0; i < args.length; i++) {
      const userId = args[i].replace(/[<@!&#>\\]/g, '')
      let member = message.guild.members.resolve(userId)
      if(!member) member = message.guild.members.cache.find(member => member.user.username === args[i] || member.user.tag === args[i])
      if(!member) {
        let user = await client.users.fetch(userId)
        .catch(() => {
          return client.users.cache.find(user => user.username === args[i] || user.tag === args[i])
        })
        if(!user) {
          failedToFind.push(userId)
          continue
        }
        const embed = new Discord.MessageEmbed()
        .setAuthor(user.tag)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(user.toString())
        .addFields(
          { name: client.getString('userinfo.id', { locale: message }), value: user.id },
          { name: client.getString('userinfo.joinedDiscord', { locale: message }), value: user.createdAt.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' }) },
        )
        .setColor(client.constants.defaultRoleColor)
        message.channel.send(embed)
      } else {
        const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(member.toString())
        .addFields(
          { name: client.getString('userinfo.id', { locale: message }), value: member.user.id },
          { name: client.getString('userinfo.joinedDiscord', { locale: message }), value: `${member.user.createdAt.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' })}\n(${timeAgo.format(member.user.createdTimestamp)})` },
          { name: client.getString('userinfo.joinedServer', { locale: message }), value: `${member.joinedAt.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' })}\n(${timeAgo.format(member.joinedTimestamp)})` },
          { name: client.getString('userinfo.serverBooster', { locale: message }), value: `${member.premiumSince ? client.getString('userinfo.boosterSince', { variables: { date: member.premiumSince.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' }) }, locale: message }) : client.getString('userinfo.notBooster', { locale: message })}` },
          { name: client.getString('userinfo.roles', { locale: message }), value: member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length ? `(${member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length}) ${(() => member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).join(', '))()}` : client.getString('userinfo.noRoles', { locale: message }) },
        )
        .setColor(member.displayColor || client.constants.defaultRoleColor)
        message.channel.send(embed)
      }
    }
    if(failedToFind.length > 0) {
      const embed = new Discord.MessageEmbed()
      .setTitle(failedToFind.length > 1 ? client.getString('userinfo.failedToFindMany', { locale: message }) : client.getString('userinfo.failedToFindOne', { locale: message }))
      .setDescription(`\`${failedToFind.join('`, `')}\``)
      .setColor(client.constants.redColor)
      message.channel.send(embed)
    }
  }
}