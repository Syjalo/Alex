const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const usersSchema = require('../schemas/users-schema')

class ABClient extends Discord.Client {
  constructor(options) {
    super(options)
  }

  async login(token) {
    this.commands = new Discord.Collection()
    this.cooldowns = new Discord.Collection()
    this.languages = new Discord.Collection()
    this.mongo = require('./mongo')
    this.config = require('../config.json')
    this.constants = require('./constants.json')

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
        if(user.locale) this.languages.set(user.userId, user.locale)
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
          this.commands.set(command.name, command)
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

  getString(path, options) {
    let { variables, locale } = options

    if(locale instanceof Discord.Message) {
      locale = this.languages.get(locale.author.id) || locale.guild.preferredLocale
    }

    const splittedPath = path.split('.')
    const fileName = splittedPath.shift()

    let stringsEn = require(`../res/values-en-US/strings/${fileName}.json`)
    let strings
    try { strings = require(`../res/values-${this.config.supportedLangs[locale]?.locale || 'en-US'}/strings/${fileName}.json`) }
    catch { strings = require(`../res/values-en-US/strings/${fileName}.json`) }

    splittedPath.forEach(pathPart => {
      try { stringsEn = stringsEn[pathPart]; strings = strings[pathPart] }
      catch {}
    })

    let string
    if(strings) string = strings
    else string = stringsEn

    if(typeof string === 'string' && typeof variables === 'object') {
      for(const [variable, value] of Object.entries(variables)) {
        string = string.split(`%${variable}%`).join(value)
      }
    }

    return string
  }

  get owner() {
    return this.users.cache.get(this.config.ownerId)
  }

  isOwner(u) {
    if(u instanceof Discord.User || u instanceof Discord.GuildMember) return u.id === this.config.ownerId
    if(u instanceof Discord.Message) return u.author.id === this.config.ownerId
    return false
  }

  toString() {
    
  }
}

module.exports = ABClient