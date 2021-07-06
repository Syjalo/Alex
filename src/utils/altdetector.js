const Discord = require('discord.js')

module.exports = (member) => {
  if(member.joinedTimestamp - member.user.createdTimestamp < 604800000) {
    const embed = new Discord.MessageEmbed()
    .setAuthor(member.user.tag, null, `https://discordapp.com/users/${member.user.id}`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(member.toString())
      .addFields(
        { name: member.client.getString('userinfo.id'), value: member.user.id },
        { name: member.client.getString('userinfo.joinedDiscord'), value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:f>\n(<t:${Math.round(member.user.createdTimestamp / 1000)}:R>)` },
        { name: member.client.getString('userinfo.joinedServer'), value: `<t:${Math.round(member.joinedTimestamp / 1000)}:f>\n(<t:${Math.round(member.joinedTimestamp / 1000)}:R>)` },
      )
      .setColor('BLURPLE')
    member.client.altDetectorChannel.send({ embeds: [embed] })
  }
}