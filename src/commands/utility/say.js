const Discord = require('discord.js')
const CommandError = require('../../errors/CommandError')
const Command = require('../../structures/Command')
const CommandOption = require('../../structures/CommandOption')

module.exports = new Command()
.setName('say')
.setDescription('Sends a message to the specified channel.')
.setCategory('utility')
.addPermsToWhitelist(Discord.Permissions.FLAGS.ADMINISTRATOR)
.setOptions([
  new CommandOption()
  .setName('channel')
  .setDescription('Specify the channel')
  .setRequired()
  .setType('CHANNEL'),
  new CommandOption()
  .setName('message')
  .setDescription('The message to send')
  .setRequired()
  .setType('STRING')
])
.setFunction((interaction, client) => {
  const targetChannel = interaction.options.first().channel

  if(!targetChannel.isText()) {
    throw new CommandError(client)
    .setMessageStringPath('errors.notTextChannel.message')
  }

  try {
    const json = JSON.parse(interaction.options.last().value)
    if(targetChannel) targetChannel.send(json)
  } catch {
    if(targetChannel) targetChannel.send({ content: interaction.options.last().value })
  }
  client.interactionSend(interaction, { content: client.getString('say.sended', { locale: interaction }), ephemeral: true })
})