const Discord = require('discord.js')

module.exports = {
  name: 'userinfo',
  aliases: ['memberinfo', 'uinfo', 'minfo'],
  async execute(message, args, client) {
    const  failedToFind = []
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
          { name: 'User ID', value: user.id },
          { name: 'Joined Discord', value: user.createdAt.toLocaleString(client.getString('dateLocale'), { day: 'numeric', month: 'long', year: 'numeric' }) }
        )
        .setColor(client.constants.defaultColor)
        message.channel.send(embed)
      } else {
        const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(member)
        .addFields(
          { name: 'User ID', value: member.user.id },
          { name: 'Joined Discord', value: member.user.createdAt.toLocaleString(client.getString('dateLocale'), { day: 'numeric', month: 'long', year: 'numeric' }) },
          { name: 'Joined Server', value: member.joinedAt.toLocaleString(client.getString('dateLocale'), { day: 'numeric', month: 'long', year: 'numeric' }) },
          { name: 'Server Nitro Booster', value: `${member.premiumSince ? `Since ${member.premiumSince.toLocaleString(client.getString('dateLocale'), { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Not a Booster'}` },
          { name: 'Roles', value: `(${member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).length}) ${(() => member.roles.cache.filter(role => role.name !== '@everyone').map(role => role).join(', '))()}` },
        )
        .setColor(member.displayColor || client.constants.defaultColor)
        message.channel.send(embed)
      }
    }
    if(failedToFind.length > 0) {
      const embed = new Discord.MessageEmbed()
      .setTitle(failedToFind.length > 1 ? `Failed to find the following users` : `Failed to find the following user`)
      .setDescription(`\`${failedToFind.join('`, `')}\``)
      .setColor(client.constants.redColor)
      message.channel.send(embed)
    }
  }
}