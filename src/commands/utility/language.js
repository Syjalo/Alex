const Discord = require('discord.js')
const CommandError = require('../../errors/CommandError')
const usersSchema = require('../../schemas/users-schema')
const Command = require('../../structures/Command')
const CommandOption = require('../../structures/CommandOption')

module.exports = new Command()
.setName('language')
.setDescription('Changes your language.')
.setCategory('utility')
.setCooldown(60)
.setMaxUsageAmount(2)
.allowInDM
.setOption(
  new CommandOption()
  .setType('STRING')
  .setName('locale')
  .setDescription('Specify the language locale')
)
.setFunction(async (interaction, client) => {
  if(!interaction.options.first()) {
    const langs = []
    for (const [locale, value] of Object.entries(client.constants.SupportedLangs)) {
      langs.push(`**${value.name}**: \`${locale}\``)
    }
    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('language.specifyLocale', { locale: interaction }))
    .setDescription(client.getString('language.supportedLanguages', { variables: { langs: langs.sort().join('\n') }, locale: interaction }))
    .setColor('BLURPLE')
    client.interactionSend(interaction, { embeds: [embed], ephemeral: true })
    return
  }
  if(!Object.keys(client.constants.SupportedLangs).includes(interaction.options.first().value)) {
    throw new CommandError(client)
    .setCode('FALSE_LANGUAGE_LOCALE')
    .setMessageStringPath('errors.falseLanguageLocale.message')
  }
  await interaction.defer({ ephemeral: true })
  await client.mongo().then(async (mongoose) => {
    try {
      users = await usersSchema.findOneAndUpdate({
        id: interaction.user.id
      },
      {
        locale: interaction.options.first().value
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
      client.languages.set(interaction.user.id, interaction.options.first().value)
      const embed = new Discord.MessageEmbed()
      .setTitle(client.getString('language.changedTitle', { locale: interaction }))
      .setDescription(client.getString('language.changedDescription', { locale: interaction }))
      .setColor('GREEN')
      client.interactionSend(interaction, { embeds: [embed], ephemeral: true })
    }
  })
})