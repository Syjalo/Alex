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
    if(message.member.permissions.has('ADMINISTRATOR')) allowed = true

    if(!allowed) {
      message.react('❌')
      setTimeout(async () => {
        if(!message.deleted) message.delete()
      }, 3000)
      return
    }

    try {
      await command.execute(message, args, client)
    } catch (error) {
      console.log(error)
    }
  }
}
