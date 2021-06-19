const Discord = require('discord.js')

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    await client.application.fetch()
    console.log('Ready!')
    if(process.env.PROCESS === 'production') {
      const embed = new Discord.MessageEmbed()
      .setTitle('Ready!')
      .setTimestamp(client.readyAt)
      .setColor(client.constants.Colors.green)
      client.owner.send({ embeds: [embed] })
    }
  }
}
