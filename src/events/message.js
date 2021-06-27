module.exports = {
  name: 'message',
  async execute(message, client) {
    if (message.author.bot) return
    if (message.channel.id === client.suggestionsChannel.id) {
      await message.react('857336659465076737')
      await message.react('857336659619348540')
      if (Math.random() * 100 < 15) {
        message.channel.send({ content: 'Any discussions in this channel will be punished with a warning.\nYou can discuss the suggestions here: <#857337710657404958>' })
      }
      return
    }
  }
}