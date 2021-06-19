
module.exports = {
  name: 'message',
  async execute(message, client) {
    client.commands.handle(message)
  }
}
