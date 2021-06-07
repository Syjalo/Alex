const Discord = require('discord.js')
const CommandError = require('../errors/CommandError')

module.exports = {
  name: 'message',
  async execute(message, client) {
    if(message.author.bot || !message.content.startsWith(client.config.prefix)) return
    const args = message.content.slice(client.config.prefix.length).trim().split(' ')
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if(!command) return

    if(!client.allowedToExecuteCommand(message, command)) {
      message.react('❌')
      setTimeout(async () => {
        if(!message.deleted) message.delete()
      }, 3000)
      return
    }

    const { cooldowns } = client

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
        .then(msg => {
          client.setTimeout(() => {
            if(!message.deleted && message.deletable) message.delete()
            if(!msg.deleted) msg.delete()
          }, 5000)
        })
      }
    }

    if(message.channel.type !== 'dm' && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !client.isOwner(message)) {
      timestamps.set(message.author.id, now)
      client.setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }

    try {
      await command.execute(message, args, client)
    } catch (error) {
      if(error instanceof CommandError) {
        const embed = new Discord.MessageEmbed()
        .setTitle(client.getString(error.stringPath, { locale: message }))
        .setColor(client.constants.redColor)
        message.reply(null, { embed, failIfNotExists: false })
        .then(errorMsg => {
          client.setTimeout(() => {
            if(errorMsg.deletable) errorMsg.delete()
            if(message.deletable) message.delete()
          }, 10000)
        })
      } else if(error.stack) {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('A fatal error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${message.author.tag} (${message.author.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor(client.constants.redColor)
        client.owner.send(devEmbed)
        const embed = new Discord.MessageEmbed()
        .setTitle(client.getString('errors.fatal', { locale: message }))
        .setColor(client.constants.redColor)
        message.reply(null, { embed, failIfNotExists: false })
        .then(errorMsg => {
          client.setTimeout(() => {
            if(errorMsg.deletable) errorMsg.delete()
            if(message.deletable) message.delete()
          }, 10000)
        })
      } else {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('An unknown error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${message.author.tag} (${message.author.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor(client.constants.redColor)
        client.owner.send(devEmbed)
        const embed = new Discord.MessageEmbed()
        .setTitle(client.getString('errors.unknown', { locale: message }))
        .setColor(client.constants.redColor)
        message.reply(null, { embed, failIfNotExists: false })
        .then(errorMsg => {
          client.setTimeout(() => {
            if(errorMsg.deletable) errorMsg.delete()
            if(message.deletable) message.delete()
          }, 10000)
        })
      }
    }
  }
}
