module.exports = {
  name: 'say',
  permsWhitelist: ['ADMINISTRATOR'],
  execute(message, args, client) {
    const targetChannelID = args[0].replace(/[<@!&#>\\]/g, '')
    const targetChannel = client.channels.resolve(targetChannelID)
    args.shift()

    if(message.guild.id !== targetChannel?.guild.id && !client.isOwner(message)) {
      message.reply(client.getString('say.anotherServer', { locale: message }))
      return
    }

    if(message.deletable) message.delete()
    if(targetChannel) targetChannel.send(args.join(' '))
  }
}