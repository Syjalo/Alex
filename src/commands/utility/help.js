const Discord = require('discord.js')
const CommandError = require('../../errors/CommandError')

module.exports = {
  name: 'help',
  cooldown: 10,
  maxUsageAmount: 2,
  execute(message, args, client) {
    if(args.length === 0) {
      const commands = client.commands.sort((commandA, commandB) => commandA.name >= commandB.name ? 1 : -1).filter(command => client.allowedToExecuteCommand(message, command) && command.category !== 'dev')

      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('help.page.title', { locale: message }))
      .setDescription(`${client.getString('help.page.description', { variables: { botMention: client.user.toString(), developer: client.owner.toString(), count: commands.map(c => c).length }, locale: message })}`)
      .setColor(client.constants.blurpleColor)

      if(commands.map(c => c).length > 0) {
        commands.each(command => {
          if(command.category !== 'dev') embed.addField(`\`${client.config.prefix}${client.getString(`help.${command.name}.usage`, { locale: message })}\``, `${client.getString(`help.${command.name}.shortDescription`, { locale: message })}`)
        })
        embed.addField(client.getString('help.note.title', { locale: message }), client.getString('help.note.description', { locale: message }))
      }

      const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setLabel(client.getString('global.button.openGitHub', { locale: message }))
        .setStyle('LINK')
        .setURL('https://github.com/Syjalo/Alex')
      )

      message.channel.send(null, { embed: embed, components: [row] })
    } else {
      const command = client.getCommand(args.join(' '))
      if(!command) {
        throw new CommandError('FALSE_COMMAND', 'errors.falseCommand.message', 'That command couldn\'t be found!')
      }
      if(!client.allowedToExecuteCommand(message, command)) {
        throw new CommandError('NO_ACCESS_SPECIFIED_COMMAND', 'errors.noAccessSpecifiedCommand.message', 'You\'re not allowed to execute the specified command!')
      }
      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('help.page.commandInformation', { locale: message, variables: { commandName: `${client.config.prefix}${command.name}` } }))
      .setDescription(client.getString(`help.${command.name}.fullDescription`, { locale: message }))
      .addFields([
        { name: client.getString('help.page.usage', { locale: message }), value: `\`${client.config.prefix}${client.getString(`help.${command.name}.usage`)}\`` },
        { name: client.getString('help.page.cooldown', { locale: message }), value: client.getString('help.page.cooldownSeconds', { locale: message, variables: { time: command.cooldown || 3 } }) },
        { name: client.getString('help.page.maxUsage', { locale: message }), value: client.getString('help.page.usageAmount', { locale: message, variables: { times: command.maxUsageAmount || 1 } }) },
        { name: client.getString('help.page.aliases', { locale: message, variables: { amount: command.aliases?.length || 0 } }), value: command.aliases ? `\`${client.config.prefix}${command.aliases.join(`\`, \`${client.config.prefix}`)}\`` : '———' }
      ])
      .setColor(client.constants.blurpleColor)
      message.channel.send(embed)
    }
  }
}