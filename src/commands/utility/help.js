const Discord = require('discord.js')
const CommandError = require('../../errors/CommandError')
const Command = require('../../structures/Command')
const CommandOption = require('../../structures/CommandOption')

module.exports = new Command()
.setName('help')
.setDescription('Shows you the help page.')
.setCategory('utility')
.setCooldown(10)
.setMaxUsageAmount(2)
.allowInDM
.setOption(
  new CommandOption()
  .setType('STRING')
  .setName('command')
  .setDescription('Specify the command name')
  .toJSON()
)
.setFunction((interaction, client) => {
  if(!interaction.options.first()) {
    const commands = client.commands.cache.sort((commandA, commandB) => commandA.name >= commandB.name ? 1 : -1).filter(command => command.allowedToExecute(interaction) && command.category !== 'dev')

    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('help.page.title', { locale: interaction }))
    .setDescription(`${client.getString('help.page.description', { variables: { botMention: client.user.toString(), developer: client.owner.toString(), count: commands.map(c => c).length }, locale: interaction })}`)
    .setColor('BLURPLE')

    if(commands.map(c => c).length > 0) {
      commands.each(command => {
        if(command.category !== 'dev') embed.addField(`\`${client.constants.Options.prefix}${command.name}\``, `${client.getString(`help.${command.name}.shortDescription`, { locale: interaction })}`)
      })
      embed.addField(client.getString('help.note.title', { locale: interaction }), client.getString('help.note.description', { locale: interaction }))
    }

    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setLabel(client.getString('global.button.openGitHub', { locale: interaction }))
      .setStyle('LINK')
      .setURL('https://github.com/Syjalo/Alex')
    )

    client.interactionSend(interaction, { embeds: [embed], components: [row] })
  } else {
    const command = client.commands.resolve(interaction.options.first().value)
    if(!command) {
      throw new CommandError(client)
      .setCode('FALSE_COMMAND')
      .setMessageStringPath('errors.falseCommand.message')
    }
    if(!command.allowedToExecute(interaction)) {
      throw new CommandError(client)
      .setCode('NO_ACCESS_SPECIFIED_COMMAND')
      .setMessageStringPath('errors.noAccessSpecifiedCommand.message')
    }
    const embed = new Discord.MessageEmbed()
    .setTitle(client.getString('help.page.commandInformation', { locale: interaction, variables: { commandName: `${client.constants.Options.prefix}${command.name}` } }))
    .setDescription(client.getString(`help.${command.name}.fullDescription`, { locale: interaction }))
    .addFields([
      { name: client.getString('help.page.usage', { locale: interaction }), value: `\`${client.constants.Options.prefix}${command.name}\`` },
      { name: client.getString('help.page.cooldown', { locale: interaction }), value: client.getString('help.page.cooldownSeconds', { locale: interaction, variables: { time: command.cooldown || 3 } }) },
      { name: client.getString('help.page.maxUsage', { locale: interaction }), value: client.getString('help.page.usageAmount', { locale: interaction, variables: { times: command.maxUsageAmount || 1 } }) }
    ])
    .setColor('BLURPLE')
    client.interactionSend(interaction, { embeds: [embed] })
  }
})