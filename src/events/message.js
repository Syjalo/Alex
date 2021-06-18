const Discord = require('discord.js')
const CommandError = require('../errors/CommandError')

module.exports = {
  name: 'message',
  async execute(message, client) {
    client.commands.handle(message)
  }
}
