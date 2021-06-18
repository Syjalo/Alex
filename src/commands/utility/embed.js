const Discord = require('discord.js')
const Command = require('../../structures/Command')
const CommandError = require('../../errors/CommandError')

module.exports = new Command()
.setName('embed')
.setCategory('utility')
.setMinArgs(2)
.addPermsToWhitelist(Discord.Permissions.FLAGS.ADMINISTRATOR)
.setFunction((message, args, client) => {
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
    const { text = null } = json

    targetChannel.send(text, {
      embed: json,
    })
  } catch (error) {
    throw new CommandError(client)
    .setCode('INVALID_JSON')
    .setMessageStringPath('errors.invalidJSON')
    .setMessageStringVariables({ errorMessage: error.message })
  }
})