const Discord = require('discord.js')

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.mainGuild = client.guilds.cache.get(process.env.MAIN_GUILD_ID)
    client.altDetectorChannel = client.channels.cache.get(process.env.ALT_DETECTOR_CHANNEL_ID)
    client.suggestionsChannel = client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID)
    
    await client.application.fetch()
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
