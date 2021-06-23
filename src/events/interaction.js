module.exports = {
  name: 'interaction',
  execute(interaction, client) {
    client.commands.handle(interaction)
  }
}