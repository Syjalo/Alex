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
  
    const readCommands = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for(const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if(stat.isDirectory()) {
          readCommands(path.join(dir, file))
        } else {
          const command = require(path.join(__dirname, dir, file))
          this.commands.add(command)
        }
      }
    }
    readCommands('../commands')
  
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

  getString(path, options = {}) {
    if(!path) return null
    let { variables, locale = 'en-US' } = options

    if(locale instanceof Discord.Message) {
      locale = this.languages.get(locale.author.id) || locale.guild.preferredLocale
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

  get owner() {
    return this.application.owner.members.find(user => user.id === this.application.owner.ownerID).user
  }

  isOwner(u) {
    if(u instanceof Discord.User || u instanceof Discord.GuildMember) return u.id === this.application.owner.id
    if(u instanceof Discord.Message) return u.author.id === this.application.owner.id
    return false
  }
}

module.exports = ABClient