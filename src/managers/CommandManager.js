const Discord = require("discord.js")
const CommandError = require('../errors/CommandError')

class CommandManager {
  constructor(client, ...cacheOptions) {
    this.cache = new Discord.Collection(...cacheOptions)

    this.client = client
  }

  add(cmd, name) {
    cmd.manager = this
    this.cache.set(name || cmd?.name || 'e', cmd)
    return cmd
  }

  resolve(name) {
    return this.cache.get(name) || this.cache.find(cmd => cmd.aliases && cmd.aliases.includes(name)) || null
  }

  resolveName(nameOrInstance) {
    return nameOrInstance?.name || this.resolve(nameOrInstance)?.name || null
  }

  async handle(message) {
    if(message.author.bot || !message.content.startsWith(this.client.constants.Options.prefix)) return
    const args = message.content.slice(this.client.constants.Options.prefix.length).trim().split(' ')
    const command = this.resolve(args.shift().toLowerCase())
    if(!command) return

    if(!command.allowedToExecute(message)) {
      message.react('❌')
      setTimeout(async () => {
        if(message.deletable) message.delete()
      }, 3000)
      return
    }

    if(command?.minArgs && command?.minArgs > args.length || command?.maxArgs && command?.maxArgs < args.length) {
      const embed = new Discord.MessageEmbed()
      .setTitle(this.client.getString('errors.invalidCommandArgs.title', { locale: message }))
      .setDescription(this.client.getString('errors.invalidCommandArgs.description', { locale: message, variables: { usage: `${this.client.constants.Options.prefix}${this.client.getString(`help.${command.name}.usage`, { locale: message })}` } }))
      .setColor(this.client.constants.Colors.red)
      message.reply(null, { embed, failIfNotExists: false })
      .then(errorMsg => {
        this.client.setTimeout(() => {
          if(errorMsg.deletable) errorMsg.delete()
          if(message.deletable) message.delete()
        }, 10000)
      })
      return
    }

    const { cooldowns } = this.client
    if (!cooldowns.has(command.name)) cooldowns.set(command.name, { timestamps: new Discord.Collection(), usage: new Discord.Collection() })
    const now = Date.now()
    const { timestamps, usage } = cooldowns.get(command.name)
    let usageAmount = usage.get(message.author.id) || 0
    const cooldownAmount = (command.cooldown || 3) * 1000
    const maxUsageAmount = command.maxUsageAmount || 1
    if(timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount
      if(now < expirationTime) {
        if(usageAmount >= maxUsageAmount) {
          const timeLeft = (expirationTime - now) / 1000
          const embed = new Discord.MessageEmbed()
          .setTitle(this.client.getString('errors.cooldownExist.message', { locale: message, variables: { timeLeft: Math.ceil(timeLeft), commandName: `${this.client.constants.Options.prefix}${command.name}` } }))
          .setColor(this.client.constants.Colors.red)
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
      usageAmount = usage.set(message.author.id, 0).get(message.author.id)
    }

    if(message.channel.type !== 'dm' && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !this.client.isOwner(message)) {
      if(usageAmount === 0) timestamps.set(message.author.id, now)
      usage.set(message.author.id, usageAmount + 1)
      this.client.setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }

    try {
      await command.execute(message, args, this.client)
    } catch (error) {
      usage.set(message.author.id, usageAmount)
      if(error instanceof CommandError) {
        const embed = new Discord.MessageEmbed()
        .setTitle(error.getTitleString(message))
        .setDescription(error.getDescriptionString(message))
        .setColor(this.client.constants.Colors.red)
        let errorMsg
        error.options.replyToAuthor ? errorMsg = message.reply(null, { embed, failIfNotExists: false }) : errorMsg = message.channel.send(null, { embed, failIfNotExists: false })
        errorMsg.then(errorMsg => {
          this.client.setTimeout(() => {
            if(errorMsg.deletable && error.options.deleteErrorMessage) errorMsg.delete()
            if(message.deletable && error.options.deleteAuthorMessage) message.delete()
          }, 10000)
        })
        return
      }
      console.error(error)
      if(error.stack && process.env.PROCESS === 'production') {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('A fatal error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${message.author.tag} (${message.author.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor(this.client.constants.Colors.red)
        this.client.owner.send(devEmbed)
        const embed = new Discord.MessageEmbed()
        .setTitle(this.client.getString('errors.fatal.message', { locale: message }))
        .setColor(this.client.constants.Colors.red)
        message.reply(null, { embed, failIfNotExists: false })
        .then(errorMsg => {
          this.client.setTimeout(() => {
            if(errorMsg.deletable) errorMsg.delete()
            if(message.deletable) message.delete()
          }, 10000)
        })
      } else if(process.env.PROCESS === 'production') {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('An unknown error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${message.author.tag} (${message.author.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor(client.constants.Colors.red)
        this.client.owner.send(devEmbed)
        const embed = new Discord.MessageEmbed()
        .setTitle(this.client.getString('errors.unknown.message', { locale: message }))
        .setColor(this.client.constants.Colors.red)
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

module.exports = CommandManager