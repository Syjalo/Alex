const Discord = require('discord.js')

module.exports = {
  name: 'embed',
  permsWhitelist: [Discord.Permissions.FLAGS.ADMINISTRATOR],
  execute(message, args, client) {
    const targetChannelID = args[0].replace(/[<@!&#>\\]/g, '')
    const targetChannel = client.channels.resolve(targetChannelID)

    if(!targetChannel) {
      message.reply(client.getString('embed.specifyChannel', { locale: message }))
      return
    }
    if(targetChannel.guild.id !== message.guild.id && !client.isOwner(message)){
      message.reply(client.getString('embed.anotherServer', { locale: message }))
      return
    }

    args.shift()

    try {
      const json = JSON.parse(args.join(' '))
      const { text = '' } = json

      targetChannel.send(text, {
        embed: json,
      })
    } catch (error) {
      message.reply(client.getString('embed.invalidJSON', { variables: { errorMessage: error.message }, locale: message }))
    }
  }
}