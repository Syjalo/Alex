const Discord = require('discord.js')

module.exports = {
  name: 'help',
  execute(message, args, client) {
    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('help.page.title', { locale: message }))
    .setDescription(`${client.getString('help.page.description', { variables: { botMention: client.user, developer: client.owner }, locale: message })}`)
    .setColor(client.constants.defaultColor)

    const commands = client.commands.sort((commandA, commandB) => commandA.name >= commandB.name ? 1 : -1)
    commands.each(command => {
      embed.addField(`\`${client.config.prefix}${client.getString(`help.${command.name}.usage`, { locale: message })}\``, client.getString(`help.${command.name}.shortDescription`, { locale: message }))
    })

    message.channel.send(embed)
  }
}