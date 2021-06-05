const Discord = require('discord.js')

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

    try {
      const json = JSON.parse(args.join(' '))
      const { text = null, replyTo = null, mention = true } = json
      if(targetChannel) targetChannel.send(text, { allowedMentions: { repliedUser: mention }, reply: { messageReference: replyTo, failIfNotExists: false } })
    } catch {
      if(targetChannel) targetChannel.send(args.join(' '))
    }
  }
}