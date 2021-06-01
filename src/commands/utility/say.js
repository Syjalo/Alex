module.exports = {
  name: 'say',
  permsWhitelist: ['ADMINISTRATOR'],
  execute(message, args, client) {
    const channelID = args[0].replace(/[<@!&#>\\]/g, '')
    args.shift()

    if(message.guild.id !== channel?.guild.id && !client.isOwner(message)) {
      message.reply(client.getString('say.anotherServer', { locale: message }))
      return
    }

    if(message.deletable) message.delete()
    if(channel) channel.send(args.join(' '))
  }
}