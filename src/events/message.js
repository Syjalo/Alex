module.exports = {
  name: 'message',
  async execute(message, client) {
    if (message.channel.id === client.suggestionsChannel.id) {
      await message.react('<:allowed:857336659465076737>')
      await message.react('<:denied:857336659619348540>')
    }
  }
}