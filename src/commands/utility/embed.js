const Discord = require('discord.js')
const Command = require('../../structures/Command')
const CommadOption = require('../../structures/CommandOption')
const CommandError = require('../../errors/CommandError')

module.exports = new Command()
.setName('embed')
.setDescription('Sends an embed to the specified channel.')
.setCategory('utility')
.addPermsToWhitelist(Discord.Permissions.FLAGS.ADMINISTRATOR)
.setOptions([
  new CommadOption()
  .setName('channel')
  .setDescription('Specify the channel')
  .setRequired()
  .setType('CHANNEL'),
  new CommadOption()
  .setName('json')
  .setDescription('Specify the text in JSON format.')
  .setRequired()
  .setType('STRING')
])
.setFunction((interaction, client) => {
  const targetChannel = interaction.options.first().channel

  if(!targetChannel) {
    client.interactionSend(interaction, { constent: client.getString('embed.specifyChannel', { locale: interaction }), ephemeral: true })
    return
  }

  try {
    const json = JSON.parse(interaction.options.last().value)

    targetChannel.send(json)
  } catch (error) {
    throw new CommandError(client)
    .setMessageStringPath('errors.invalidJSON')
    .setMessageStringVariables({ errorMessage: error.message })
  } finally {
    client.interactionSend(interaction, { content: client.getString('embed.sended', { locale: interaction }), ephemeral: true })
  }
})