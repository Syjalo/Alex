const Discord = require('discord.js')

module.exports = {
  name: 'help',
  execute(message, args, client) {
    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('help.page.title', message))
    .setDescription(`${client.getString('help.page.description', { botMention: client.user, developer: client.owner }, message)}`)
    .setColor(client.constants.defaultColor)

    const commands = client.commands.sort((commandA, commandB) => commandA.name >= commandB.name ? 1 : -1)
    commands.each(command => {
      embed.addField(`\`${client.config.prefix}${client.getString(`help.${command.name}.usage`, message)}\``, client.getString(`help.${command.name}.shortDescription`, message))
    })

    message.channel.send(embed)
  }
}