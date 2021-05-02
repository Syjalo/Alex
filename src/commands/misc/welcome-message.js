const Discord = require('discord.js')
const welcomeMessageSchema = require('../../schemas/welcome-messages-schema')

module.exports = {
  name: 'welcomemessage',
  aliases: ['wmessage', 'wmsg'],
  permsWhitelist: ['ADMINISTRATOR'],
  async execute(message, args, client) {
     if(!args.length) {
      const embed = new Discord.MessageEmbed()
      .setTitle('Enter a welcome message after the command')
      .setDescription(`\`${client.config.prefix}${this.name} [channel mention | channel ID] <message>\`\n\nYou can specify \`%memberMention%\`, \`%guildName%\` or \`%guildMemberCount%\` in a welcome message.\nThey will be replaced with the member mention, the server name and amount of members in this server respectively.`)
      .setColor(client.config.colorDefault)
      message.channel.send(embed)
      return
    }
    
    const channelId = args.shift().replace(/[\\<>@&!#]/g, '')
    if(!client.channels.resolve(channelId)) {
      const embed = new Discord.MessageEmbed()
      .setTitle('Invalid Channel')
      .setDescription('You must specify a channel mention or a channel ID.')
      .setColor(client.config.colorRed)
      message.channel.send(embed)
      return
    }
    const wMessage = args.join(' ')
    await client.mongo().then(async (mongoose) => {
      try {
        await welcomeMessageSchema.findOneAndUpdate(
          {
            guildId: message.guild.id,
          },
          {
            message: wMessage,
            channelId,
          },
          {
            upsert: true,
          }
        )
      } finally {
        client.welcomeMessages.set(message.guild.id, { channelId, message: wMessage })
        mongoose.connection.close()
      }
    })
  }
}