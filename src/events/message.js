module.exports = {
  name: 'message',
  async execute(message, client) {
    if (message.channel.id === client.suggestionsChannel.id) {
      await message.react('857336659465076737')
      await message.react('857336659619348540')
    }
  }
}