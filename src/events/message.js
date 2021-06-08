const Discord = require('discord.js')
const { Collection } = require('mongoose')
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
        if(message.deletable) message.delete()
      }, 3000)
      return
    }

    if(command?.minArgs > args.length || command?.maxArgs < args.length) {
      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('errors.invalidCommandArgs.title', { locale: message }))
      .setDescription(client.getString('errors.invalidCommandArgs.description', { locale: message, variables: { usage: `${client.config.prefix}${client.getString(`help.${command.name}.usage`, { locale: message })}` } }))
      .setColor(client.constants.redColor)
      message.reply(null, { embed, failIfNotExists: false })
      .then(errorMsg => {
        client.setTimeout(() => {
          if(errorMsg.deletable) errorMsg.delete()
          if(message.deletable) message.delete()
        }, 10000)
      })
      return
    }

    const { cooldowns } = client
    if (!cooldowns.has(command.name)) cooldowns.set(command.name, { timestamps: new Discord.Collection(), usage: new Discord.Collection() })
    const now = Date.now()
    const { timestamps, usage } = cooldowns.get(command.name)
    let usageCount = usage.get(message.author.id) || 0
    const cooldownAmount = (command.cooldown || 3) * 1000
    const maxUsageCount = command.maxUsageCount || 1
    if(timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount
      if(now < expirationTime) {
        if(usageCount >= maxUsageCount) {
          const timeLeft = (expirationTime - now) / 1000
          const embed = new Discord.MessageEmbed()
          .setTitle(client.getString('errors.cooldownExist.message', { locale: message, variables: { timeLeft: Math.ceil(timeLeft), commandName: `${client.config.prefix}${command.name}` } }))
          .setColor(client.constants.redColor)
          return message.reply(null, { embed, failIfNotExists: false })
          .then(msg => {
            client.setTimeout(() => {
              if(msg.deletable) msg.delete()
              if(message.deletable) message.delete()
            }, 10000)
          })
        }
      }
    } else {
      usageCount = usage.set(message.author.id, 0).get(message.author.id)
    }

    if(message.channel.type !== 'dm' && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !client.isOwner(message)) {
      if(usageCount === 0) timestamps.set(message.author.id, now)
      usage.set(message.author.id, usageCount + 1)
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
        return
      }
      console.error(error)
      if(error.stack && process.env.PROCESS === 'production') {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('A fatal error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${message.author.tag} (${message.author.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor(client.constants.redColor)
        client.owner.send(devEmbed)
        const embed = new Discord.MessageEmbed()
        .setTitle(client.getString('errors.fatal.message', { locale: message }))
        .setColor(client.constants.redColor)
        message.reply(null, { embed, failIfNotExists: false })
        .then(errorMsg => {
          client.setTimeout(() => {
            if(errorMsg.deletable) errorMsg.delete()
            if(message.deletable) message.delete()
          }, 10000)
        })
      } else if(process.env.PROCESS === 'production') {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('An unknown error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${message.author.tag} (${message.author.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor(client.constants.redColor)
        client.owner.send(devEmbed)
        const embed = new Discord.MessageEmbed()
        .setTitle(client.getString('errors.unknown.message', { locale: message }))
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
