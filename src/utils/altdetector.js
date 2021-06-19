const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')

module.exports = (member) => {
  if(member.user.createdTimestamp - member.joinedTimestamp < 604800) {
    const channel = member.client.channels.resolve('855823003392933898')
    if(!channel) return
    const timeAgo = new TimeAgo('en-US')
    const getDateToLocaleString = (date) => date.toLocaleString(member.client.getString('global.dateLocale'), { timeZone: member.client.getString('global.dateTimeZone'), day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long' })
    const embed = new Discord.MessageEmbed()
    .setAuthor(member.user.tag, null, `https://discordapp.com/users/${member.user.id}`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(member.toString())
      .addFields(
        { name: member.client.getString('userinfo.id'), value: member.user.id },
        { name: member.client.getString('userinfo.joinedDiscord'), value: `${getDateToLocaleString(member.user.createdAt)}\n(${timeAgo.format(member.user.createdTimestamp)})` },
        { name: member.client.getString('userinfo.joinedServer'), value: `${getDateToLocaleString(member.joinedAt)}\n(${timeAgo.format(member.joinedTimestamp)})` },
        { name: member.client.getString('userinfo.serverBooster'), value: `${member.premiumSince ? `${member.client.getString('userinfo.boosterSince', { variables: { date: getDateToLocaleString(member.premiumSince) } })}\n(${timeAgo.format(member.premiumSinceTimestamp)})` : member.client.getString('userinfo.notBooster')}` },
        { name: member.client.getString('userinfo.roles', { variables: { count: member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length } }), value: member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length ? (() => member.roles.cache.filter(role => role.name !== '@everyone').sort((role1, role2) => role1 - role2).map(role => role).join(', '))() : '———' },
      )
      .setColor(member.displayColor || member.client.constants.Colors.defaultRole)
    channel.send({ embeds: [embed] })
  }
}