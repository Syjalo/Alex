const Discord = require('discord.js')

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log('Ready!')
    if(process.env.PROCESS === 'production') {
      const embed = new Discord.MessageEmbed()
      .setTitle('Ready!')
      .setColor(client.constants.greenColor)
      client.owner.send(embed)
    }
  }
}
