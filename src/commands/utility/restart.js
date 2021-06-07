const Discord = require('discord.js')

module.exports = {
  name: 'restart',
  allowedInDM: true,
  ownerOnly: true,
  async execute(message, aegs, client) {
    const embed = new Discord.MessageEmbed()
    .setTitle('Restarting...')
    .setColor(client.constants.yellowColor)
    await client.owner.send(embed)
    process.exit(143)
  }
}