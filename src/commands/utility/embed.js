const Discord = require('discord.js')

module.exports = {
  name: 'embed',
  permsWhitelist: [Discord.Permissions.FLAGS.ADMINISTRATOR],
  execute(message, args, client) {
    const targetChannel = message.mentions.channels.first()
    if (!targetChannel) {
      message.reply(client.getString('embed.specifyChannel'))
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
      message.reply(client.getString('invalidJSON', { errorMessage: error.message }))
    }
  }
}