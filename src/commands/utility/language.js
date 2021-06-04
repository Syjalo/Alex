const Discord = require('discord.js')
const usersSchema = require('../../schemas/users-schema')

module.exports = {
  name: 'language',
  aliases: ['lang'],
  async execute(message, args, client) {
    if(args.length === 0) {
      const langs = []
      for (const [locale, value] of Object.entries(client.config.supportedLangs)) {
        langs.push(`**${value.name}**: \`${locale}\``)
      }
      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('language.specifyLocale', { locale: message }))
      .setDescription(client.getString('language.supportedLanguages', { variables: { langs: langs.sort().join('\n') }, locale: message }))
      .setColor(client.constants.defaultColor)
      message.channel.send(embed)
      return
    }
    if(!Object.keys(client.config.supportedLangs).includes(args[0])) {
      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('language.currentlyNotSupported', { locale: message }))
      .setColor(client.constants.redColor)
      message.channel.send(embed)
      return
    }
    await client.mongo().then(async (mongoose) => {
      try {
        users = await usersSchema.findOneAndUpdate({
          id: message.author.id
        },
        {
          locale: args[0]
        },
        {
          upsert: true
        })
      } finally {
        mongoose.connection.close()
        client.languages.set(message.author.id, args[0])
        const embed = new Discord.MessageEmbed()
        .setTitle(client.getString('language.changedTitle', { locale: message }))
        .setDescription(client.getString('language.changedDescription', { locale: message }))
        .setColor(client.constants.greenColor)
        message.channel.send(embed)
      }
    })
  }
}