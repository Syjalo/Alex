const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')

module.exports = (member) => {
  if(member.joinedTimestamp - member.user.createdTimestamp < 604800000) {
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
      )
      .setColor('BLURPLE')
    member.client.altDetectorChannel.send({ embeds: [embed] })
  }
}