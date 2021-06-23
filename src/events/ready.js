const Discord = require('discord.js')

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    await client.application.fetch()
    client.mainGuild = client.guilds.cache.get(process.env.MAIN_GUILD_ID)
    client.altDetectorChannel = client.channels.cache.get(process.env.ALT_DETECTOR_CHANNEL_ID)
    await client.mainGuild.commands.fetch()
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
