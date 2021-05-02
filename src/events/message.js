const Discord = require('discord.js')

module.exports = (client) => {
  client.on('message', async (message) => {
    if(message.author.bot || !message.content.startsWith(client.config.prefix)) return
    const args = message.content.slice(client.config.prefix.length).split(' ')
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if(!command) return

    if(message.channel.type === 'dm') return

    let allowed = true
    if(command.permsBlacklist) {
      command.permsBlacklist.forEach(p => {
        allowed = true
        if(message.member.hasPermission(p)) allowed = false
      })
    }
    if(command.permsWhitelist) {
      command.permsWhitelist.forEach(p => {
        allowed = false
        if(message.member.hasPermission(p)) allowed = true
      })
    }
    if(message.member.hasPermission('ADMINISTRATOR')) allowed = true

    if(!allowed) {
      message.react('❌')
      setTimeout(async () => {
        await message.fetch(true)
        if(!message.deleted) message.delete()
      }, 3000)
      return
    }

    try {
      await command.execute(message, args, client)
    } catch (error) {
      console.log(error)
    }
  })
}
