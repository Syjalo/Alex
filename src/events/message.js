const Discord = require('discord.js')

module.exports = {
  name: 'message',
  async execute(message, client) {
    if(message.author.bot || !message.content.startsWith(client.config.prefix) || message.channel.type === 'dm') return
    const args = message.content.slice(client.config.prefix.length).trim().split(' ')
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if(!command) return

    let allowed = true
    if(command.permsBlacklist) {
      command.permsBlacklist.forEach(p => {
        allowed = true
        if(message.member.permissions.has(p)) allowed = false
      })
    }
    if(command.permsWhitelist) {
      command.permsWhitelist.forEach(p => {
        allowed = false
        if(message.member.permissions.has(p)) allowed = true
      })
    }
    if(message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) allowed = true
    if(client.isOwner(message.author)) allowed = true

    if(!allowed) {
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

    if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !client.isOwner(message.author)) {
      timestamps.set(message.author.id, now)
      client.setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }

    try {
      await command.execute(message, args, client)
    } catch (error) {
      console.log(error)
    }
  }
}
