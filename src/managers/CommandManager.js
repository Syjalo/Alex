const Discord = require("discord.js")
const CommandError = require('../errors/CommandError')
const fs = require('fs')
const path = require('path')

class CommandManager {
  constructor(client, ...cacheOptions) {
    this.cache = new Discord.Collection(...cacheOptions)

    this.client = client
  }

  add(cmd, name) {
    cmd.manager = this
    this.cache.set(name || cmd?.name, cmd)
    return cmd
  }

  resolve(instance) {
    return this.cache.get(instance) || this.cache.find(cmd => cmd.name === instance) || null
  }

  resolveName(instance) {
    return this.resolve(instance)?.name || null
  }

  async setup(dir = '../commands') {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for(const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if(stat.isDirectory()) {
        this.setup(path.join(dir, file))
      } else {
        const command = require(path.join(__dirname, dir, file))
        const slashCommand = await this.client.mainGuild.commands.create(command.toJSON())
        command.setCommand(slashCommand)
        this.add(command, slashCommand.id)
      }
    }
  }

  async handle(interaction) {
    if(!interaction.isCommand() || interaction.user.bot) return
    const command = this.resolve(interaction.commandID)
    if(!command) return

    if(!command.allowedToExecute(interaction)) {
      this.client.interactionSend(interaction, { content: this.client.getString('global.notAllowedUseCommand', { locale: interaction }), ephemeral: true })
      return
    }

    const { cooldowns } = this.client
    if (!cooldowns.has(command.name)) cooldowns.set(command.name, { timestamps: new Discord.Collection(), usage: new Discord.Collection() })
    const now = Date.now()
    const { timestamps, usage } = cooldowns.get(command.name)
    let usageAmount = usage.get(interaction.user.id) || 0
    const cooldownAmount = (command.cooldown || 3) * 1000
    const maxUsageAmount = command.maxUsageAmount || 1
    if(timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
      if(now < expirationTime) {
        if(usageAmount >= maxUsageAmount) {
          const timeLeft = (expirationTime - now) / 1000
          const embed = new Discord.MessageEmbed()
          .setTitle(this.client.getString('errors.cooldownExist.message', { locale: interaction, variables: { timeLeft: Math.ceil(timeLeft), commandName: `${this.client.constants.Options.prefix}${command.name}` } }))
          .setColor('RED')
          this.client.interactionSend(interaction, { embeds: [embed], ephemeral: true })
          return
        }
      }
    } else {
      usageAmount = usage.set(interaction.user.id, 0).get(interaction.user.id)
    }

    if(interaction.channel.type !== 'dm' && !interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !this.client.isOwner(interaction.user)) {
      if(usageAmount === 0) timestamps.set(interaction.user.id, now)
      usage.set(interaction.user.id, usageAmount + 1)
      this.client.setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
    }

    try {
      await command.execute(interaction, this.client)
    } catch (error) {
      usage.set(interaction.user.id, usageAmount)
      if(error instanceof CommandError) {
        const embed = new Discord.MessageEmbed()
        .setTitle(error.getTitleString(interaction))
        .setDescription(error.getDescriptionString(interaction))
        .setColor('RED')
        this.client.interactionSend(interaction, { embeds: [embed], ephemeral: error.options.ephemeral })
        return
      }
      console.error(error)
      if(error.stack && process.env.PROCESS === 'production') {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('A fatal error occurred')
        .setDescription(`Channel type: \`${interaction.channel.type}\`\nExecuted by: \`${interaction.user.tag} (${interaction.user.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor('RED')
        this.client.owner.send({ embeds: [devEmbed] })
        const embed = new Discord.MessageEmbed()
        .setTitle(this.client.getString('errors.fatal.message', { locale: interaction }))
        .setColor('RED')
        this.client.interactionSend(interaction, { embeds: [embed], ephemeral: true })
      } else if(process.env.PROCESS === 'production') {
        const devEmbed = new Discord.MessageEmbed()
        .setTitle('An unknown error occurred')
        .setDescription(`Channel type: \`${message.channel.type}\`\nExecuted by: \`${interaction.user.tag} (${interaction.user.id})\`\n\n\`\`\`${error.stack}\`\`\``)
        .setColor('RED')
        this.client.owner.send({ embeds: [devEmbed] })
        const embed = new Discord.MessageEmbed()
        .setTitle(this.client.getString('errors.unknown.message', { locale: message }))
        .setColor('RED')
        this.client.interactionSend(interaction, { embeds: [embed], ephemeral: true })
      }
    }
  }
}

module.exports = CommandManager