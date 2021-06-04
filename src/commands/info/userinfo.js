const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')

module.exports = {
  name: 'userinfo',
  aliases: ['memberinfo', 'uinfo', 'minfo'],
  async execute(message, args, client) {
    const timeAgo = new TimeAgo(client.languages.get(message.author.id || message.guild.preferredLocale || 'en-US'))
    const data = []
    const failedToFind = []

    if(args.length === 0) args[0] = message.author.id

    for(const guildMemberResolvable of args) {
      const member = message.guild.members.resolve(guildMemberResolvable) || message.guild.members.cache.find(member => member.user.username === guildMemberResolvable || member.user.tag === guildMemberResolvable)
      const user = await client.users.fetch(guildMemberResolvable)
      if(member) data.push(member)
      else data.push(user)
    }

    data.forEach(d => {
      const embed = new Discord.MessageEmbed()
      if(d instanceof Discord.GuildMember) {
        embed
        .setAuthor(d.user.tag, null, `https://discordapp.com/users/${d.user.id}`)
        .setThumbnail(d.user.displayAvatarURL({ dynamic: true }))
        .setDescription(d.toString())
        .addFields(
          { name: client.getString('userinfo.id', { locale: message }), value: d.user.id },
          { name: client.getString('userinfo.joinedDiscord', { locale: message }), value: `${d.user.createdAt.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' })}\n(${timeAgo.format(d.user.createdTimestamp)})` },
          { name: client.getString('userinfo.joinedServer', { locale: message }), value: `${d.joinedAt.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' })}\n(${timeAgo.format(d.joinedTimestamp)})` },
          { name: client.getString('userinfo.serverBooster', { locale: message }), value: `${d.premiumSince ? client.getString('userinfo.boosterSince', { variables: { date: d.premiumSince.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' }) }, locale: message }) : client.getString('userinfo.notBooster', { locale: message })}` },
          { name: client.getString('userinfo.roles', { locale: message, variables: { count: d.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length } }), value: d.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length ? (() => d.roles.cache.filter(role => role.name !== '@everyone').map(role => role).join(', '))() : '———' },
        )
        .setColor(d.displayColor || client.constants.defaultRoleColor)
      }
      if(d instanceof Discord.User) {
        embed
        .setAuthor(d.tag, null, `https://discordapp.com/users/${d.id}`)
        .setThumbnail(d.displayAvatarURL({ dynamic: true }))
        .setDescription(d.toString())
        .addFields(
          { name: client.getString('userinfo.id', { locale: message }), value: d.id },
          { name: client.getString('userinfo.joinedDiscord', { locale: message }), value: `${d.createdAt.toLocaleString(client.getString('global.dateLocale', { locale: message }), { day: 'numeric', month: 'long', year: 'numeric' })}\n(${timeAgo.format(d.createdTimestamp)})` },
        )
        .setColor(client.constants.defaultRoleColor)
      }
      message.channel.send(embed)
    })
  }
}
