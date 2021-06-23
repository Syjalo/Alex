const Discord = require('discord.js')

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    await client.application.fetch()
    await client.application.commands.fetch()
    await client.guilds.cache.get('724163890803638273').commands.fetch()
    await client.commands.setup()
    console.log('Ready!')
    if(process.env.PROCESS === 'production') {
      const embed = new Discord.MessageEmbed()
      .setTitle('Ready!')
      .setTimestamp(client.readyAt)
      .setColor('GREEN')
      client.owner.send({ embeds: [embed] })
    }
  }
}
