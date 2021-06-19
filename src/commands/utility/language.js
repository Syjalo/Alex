const Discord = require('discord.js')
const CommandError = require('../../errors/CommandError')
const usersSchema = require('../../schemas/users-schema')
const Command = require('../../structures/Command')

module.exports = new Command()
.setName('language')
.setCategory('utility')
.setAliases('lang')
.setCooldown(60)
.setMaxUsageAmount(2)
.allowInDM
.setFunction(async (message, args, client) => {
  if(args.length === 0) {
    const langs = []
    for (const [locale, value] of Object.entries(client.constants.SupportedLangs)) {
      langs.push(`**${value.name}**: \`${locale}\``)
    }
    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('language.specifyLocale', { locale: message }))
    .setDescription(client.getString('language.supportedLanguages', { variables: { langs: langs.sort().join('\n') }, locale: message }))
    .setColor('BLURPLE')
    message.channel.send(embed)
    return
  }
  if(!Object.keys(client.constants.SupportedLangs).includes(args[0])) {
    throw new CommandError(client)
    .setCode('FALSE_LANGUAGE_LOCALE')
    .setMessageStringPath('errors.falseLanguageLocale')
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
    } catch (error) {
      if(error instanceof mongoose.Error) {
        throw new CommandError(client)
        .setCode('DB_ERROR')
        .setMessageStringPath('errors.dbError.message')
      } else throw error
    } finally {
      mongoose.connection.close()
      client.languages.set(message.author.id, args[0])
      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('language.changedTitle', { locale: message }))
      .setDescription(client.getString('language.changedDescription', { locale: message }))
      .setColor('GREEN')
      message.channel.send({ embeds: [embed] })
    }
  })
})