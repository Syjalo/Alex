const Discord = require('discord.js')
const TimeAgo = require('javascript-time-ago')
const { IntlMessageFormat } = require('intl-messageformat')
const fs = require('fs')
const path = require('path')
const usersSchema = require('../schemas/users-schema')
const CommandManager = require('../managers/CommandManager')

class ABClient extends Discord.Client {
  constructor(options) {
    super(options)
  }

  async login(token) {
    this.commands = new CommandManager(this)
    this.cooldowns = new Discord.Collection()
    this.languages = new Discord.Collection()
    this.mongo = require('../utils/mongo')
    this.constants = require('../utils/constants')

    TimeAgo.setDefaultLocale('en-US')
    for(const locale in this.constants.SupportedLangs) {
      TimeAgo.addLocale(require(`javascript-time-ago/locale/${locale.split('-')[0]}`))
    }

    const fetchDataBase = async () => {
      let users
      await this.mongo().then(async (mongoose) => {
        try {
          users = await usersSchema.find()
        } finally {
          mongoose.connection.close()
        }
      })
      users.forEach(user => {
        if(user.locale) this.languages.set(user.id, user.locale)
      })
    }
    fetchDataBase()
  
    const readEvents = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for(const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if(stat.isDirectory()) {
          readEvents(path.join(dir, file))
        } else {
          const event = require(path.join(__dirname, dir, file))
          if(event.once) this.once(event.name, (...args) => event.execute(...args, this))
          else this.on(event.name, (...args) => event.execute(...args, this))
        }
      }
    }
    readEvents('../events')

    return super.login(token)
  }

  getDateToLocaleString(instance, locale) {
    const date = new Date(instance)
    return date.toLocaleString(this.getString('global.dateLocale', { locale }), { timeZone: this.getString('global.dateTimeZone', { locale }), day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long' })
  }

  getString(path, options = {}) {
    if(!path) return null
    let { variables, locale = 'en-US' } = options

    if(locale instanceof Discord.CommandInteraction) {
      locale = this.languages.get(locale.user.id) || locale.member.guild.preferredLocale
    }

    const splittedPath = path.split('.')
    const fileName = splittedPath.shift()

    let stringsEn = require(`../res/values-en-US/strings/${fileName}.json`)
    let strings
    try { strings = require(`../res/values-${this.constants.SupportedLangs[locale]?.locale || 'en-US'}/strings/${fileName}.json`) }
    catch { strings = require(`../res/values-en-US/strings/${fileName}.json`) }

    splittedPath.forEach(pathPart => {
      try { stringsEn = stringsEn[pathPart]; strings = strings[pathPart] }
      catch {}
    })

    let string
    if(strings) string = strings
    else string = stringsEn

    if(typeof string === 'string' && typeof variables === 'object') {
      try { string = new IntlMessageFormat(string, locale).format(variables) }
      catch {}
    }

    return string
  }

  async interactionSend(interaction, options) {
    if(interaction.deferred || interaction.replied) return await interaction.followUp(options)
    else return await interaction.reply(options)
  }

  get owner() {
    return this.application.owner.owner.user
  }

  isOwner(u) {
    const id = this.users.resolveID(u) || u
    return id === this.owner.id
  }
}

module.exports = ABClient