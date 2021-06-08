const Discord = require('discord.js')

module.exports = {
  name: 'help',
  execute(message, args, client) {
    const commands = client.commands.sort((commandA, commandB) => commandA.name >= commandB.name ? 1 : -1).filter(command => client.allowedToExecuteCommand(message, command) && command.category !== 'dev')

    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('help.page.title', { locale: message }))
    .setDescription(`${client.getString('help.page.description', { variables: { botMention: client.user.toString(), developer: client.owner.toString(), count: commands.map(c => c).length }, locale: message })}`)
    .setColor(client.constants.defaultColor)

    if(commands.map(c => c).length > 0) {
      commands.each(command => {
        if(command.category !== 'dev') embed.addField(`\`${client.config.prefix}${client.getString(`help.${command.name}.usage`, { locale: message })}\``, `${client.getString(`help.${command.name}.shortDescription`, { locale: message })}`)
      })
      embed.addField(client.getString('help.note.title', { locale: message }), client.getString('help.note.description', { locale: message }))
    }

    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setLabel(client.getString('help.page.buttonOpenGitHub', { locale: message }))
      .setStyle('LINK')
      .setURL('https://github.com/Syjalo/Alex')
    )

    message.channel.send(null, { embed: embed, components: [row] })
  }
}