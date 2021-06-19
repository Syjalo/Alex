const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')
const Command = require('../../structures/Command')
const CommandError = require('../../errors/CommandError')

module.exports = new Command()
.setName('userinfo')
.setCategory('info')
.setAliases('memberinfo', 'uinfo', 'minfo')
.setCooldown(10)
.setMaxUsageAmount(2)
.setFunction(async (message, args, client) => {
  const timeAgo = new TimeAgo(client.languages.get(message.author.id || message.guild.preferredLocale || 'en-US'))
  const data = []
  const failedToFind = []

  if(args.length === 0) args[0] = message.author.id

  for(let instance of args) {
    let member
    let user
    try {
      member = message.guild.members.resolve(instance.replace(/[<@!>]/g, '')) || message.guild.members.cache.find(member => member.user.username.toLowerCase() === instance.toLowerCase() || member.displayName.toLowerCase() === instance.toLowerCase() || member.user.tag.toLowerCase() === instance.toLowerCase())
      user = client.users.cache.find(user => user.username.toLowerCase() === instance.toLowerCase() || user.tag.toLowerCase() === instance) || await client.users.fetch(instance.toLowerCase())
    } catch {}
    
    if(member) data.push(member)
    else if(user) data.push(user)
    else failedToFind.push(instance)
  }
  const getDateToLocaleString = (date) => {
    return date.toLocaleString(client.getString('global.dateLocale', { locale: message }), { timeZone: client.getString('global.dateTimeZone', { locale: message }), day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long' })
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
        { name: client.getString('userinfo.joinedDiscord', { locale: message }), value: `${getDateToLocaleString(d.user.createdAt)}\n(${timeAgo.format(d.user.createdTimestamp)})` },
        { name: client.getString('userinfo.joinedServer', { locale: message }), value: `${getDateToLocaleString(d.joinedAt)}\n(${timeAgo.format(d.joinedTimestamp)})` },
        { name: client.getString('userinfo.serverBooster', { locale: message }), value: `${d.premiumSince ? `${client.getString('userinfo.boosterSince', { variables: { date: getDateToLocaleString(d.premiumSince) }, locale: message })}\n(${timeAgo.format(d.premiumSinceTimestamp)})` : client.getString('userinfo.notBooster', { locale: message })}` },
        { name: client.getString('userinfo.roles', { locale: message, variables: { count: d.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length } }), value: d.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length ? (() => d.roles.cache.filter(role => role.name !== '@everyone').sort((role1, role2) => role1 - role2).map(role => role).join(', '))() : '———' },
      )
      .setColor(d.displayColor || 'LIGHT_GREY')
    }
    if(d instanceof Discord.User) {
      embed
      .setAuthor(d.tag, null, `https://discordapp.com/users/${d.id}`)
      .setThumbnail(d.displayAvatarURL({ dynamic: true }))
      .setDescription(d.toString())
      .addFields(
        { name: client.getString('userinfo.id', { locale: message }), value: d.id },
        { name: client.getString('userinfo.joinedDiscord', { locale: message }), value: `${getDateToLocaleString(d.createdAt)}\n(${timeAgo.format(d.createdTimestamp)})` },
      )
      .setColor('LIGHT_GREY')
    }
    message.channel.send({ embeds: [embed] })
  })

  if(failedToFind.length > 0) {
    throw new CommandError(client)
    .setCode('FALSE_USER')
    .setTitleStringPath('errors.falseUser.title')
    .setDescriptionString(`\`${failedToFind.join('`, `')}\``)
    .setTitleStringVariables({ count: failedToFind.length })
    .setOptions({ deleteAuthorMessage: false, deleteErrorMessage: false, replyToAuthor: false })
  }
})