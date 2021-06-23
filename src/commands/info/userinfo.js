const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')
const Command = require('../../structures/Command')
const CommandError = require('../../errors/CommandError')
const CommandOption = require('../../structures/CommandOption')

module.exports = new Command()
.setName('userinfo')
.setDescription('Gives you the specified user information.')
.setCategory('info')
.setCooldown(10)
.setMaxUsageAmount(2)
.setOption(
  new CommandOption()
  .setType('STRING')
  .setName('users')
  .setDescription('Specify the user(s)')
  .toJSON()
)
.setFunction(async (interaction, client) => {
  await interaction.defer()
  const timeAgo = new TimeAgo(client.languages.get(interaction.user.id || interaction.member.guild.preferredLocale || 'en-US'))
  const data = []
  const failedToFind = []
  let instances = []

  if (interaction.options.first()) instances = instances.concat(interaction.options.first().value.split(' '))

  if (instances.length === 0) instances.push(interaction.user.id)

  for (let instance of instances) {
    let member
    let user
    try {
      member = interaction.member.guild.members.resolve(instance.replace(/[<@!>]/g, '')) || interaction.member.guild.members.cache.find(member => member.user.username.toLowerCase() === instance.toLowerCase() || member.displayName.toLowerCase() === instance.toLowerCase() || member.user.tag.toLowerCase() === instance.toLowerCase())
      user = client.users.cache.find(user => user.username.toLowerCase() === instance.toLowerCase() || user.tag.toLowerCase() === instance) || await client.users.fetch(instance.toLowerCase())
    } catch {}
    
    if (member) data.push(member)
    else if (user) data.push(user)
    else failedToFind.push(instance)
  }
  const getDateToLocaleString = (date) => {
    return date.toLocaleString(client.getString('global.dateLocale', { locale: interaction }), { timeZone: client.getString('global.dateTimeZone', { locale: interaction }), day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long' })
  }

  data.forEach(async d => {
    const embed = new Discord.MessageEmbed()
    if(d instanceof Discord.GuildMember) {
      let statusValue
      switch(d.user.presence.status) {
        case 'online':
          statusValue = `<:online:857254722276294656>${client.getString('userinfo.status.online', { locale: interaction })}`
          break
        case 'idle':
          statusValue = `<:idle:857254721281327145>${client.getString('userinfo.status.idle', { locale: interaction })}`
          break
        case 'offline':
          statusValue = `<:offline:857254722590343199>${client.getString('userinfo.status.offline', { locale: interaction })}`
          break
        case 'dnd':
          statusValue = `<:dnd:857254721748598786>${client.getString('userinfo.status.dnd', { locale: interaction })}`
          break
      }
      if(d.user.presence.clientStatus?.mobile) statusValue += `${client.getString('userinfo.status.mobile', { locale: interaction })}`
      embed
      .setAuthor(d.user.tag, null, `https://discordapp.com/users/${d.user.id}`)
      .setThumbnail(d.user.displayAvatarURL({ dynamic: true }))
      .setDescription(d.toString())
      .addFields(
        { name: client.getString('userinfo.status.title', { locale: interaction }), value: statusValue },
        { name: client.getString('userinfo.id', { locale: interaction }), value: d.user.id },
        { name: client.getString('userinfo.joinedDiscord', { locale: interaction }), value: `${getDateToLocaleString(d.user.createdAt)}\n(${timeAgo.format(d.user.createdTimestamp)})` },
        { name: client.getString('userinfo.joinedServer', { locale: interaction }), value: `${getDateToLocaleString(d.joinedAt)}\n(${timeAgo.format(d.joinedTimestamp)})` },
        { name: client.getString('userinfo.serverBooster', { locale: interaction }), value: `${d.premiumSince ? `${client.getString('userinfo.boosterSince', { variables: { date: getDateToLocaleString(d.premiumSince) }, locale: interaction })}\n(${timeAgo.format(d.premiumSinceTimestamp)})` : client.getString('userinfo.notBooster', { locale: interaction })}` },
        { name: client.getString('userinfo.roles', { locale: interaction, variables: { count: d.roles.cache.filter(role => role.name !== '@everyone').size } }), value: d.roles.cache.filter(role => role.name !== '@everyone').size ? (() => d.roles.cache.filter(role => role.name !== '@everyone').sort((role1, role2) => role2.rawPosition - role1.rawPosition).map(role => role).join(', '))() : '———' },
      )
      .setColor(d.displayColor || 'LIGHT_GREY')
    }
    if (d instanceof Discord.User) {
      embed
      .setAuthor(d.tag, null, `https://discordapp.com/users/${d.id}`)
      .setThumbnail(d.displayAvatarURL({ dynamic: true }))
      .setDescription(d.toString())
      .addFields(
        { name: client.getString('userinfo.id', { locale: interaction }), value: d.id },
        { name: client.getString('userinfo.joinedDiscord', { locale: interaction }), value: `${getDateToLocaleString(d.createdAt)}\n(${timeAgo.format(d.createdTimestamp)})` },
      )
      .setColor('LIGHT_GREY')
    }
    await client.interactionSend(interaction, { embeds: [embed] })
  })

  if (failedToFind.length > 0) {
    throw new CommandError(client)
    .setCode('FALSE_USER')
    .setTitleStringPath('errors.falseUser.title')
    .setDescriptionString(`\`${failedToFind.join('`, `')}\``)
    .setTitleStringVariables({ count: failedToFind.length })
    .setOptions({ ephemeral: false })
  }
})