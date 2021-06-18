const Discord = require('discord.js')
const CommandError = require('../errors/CommandError')

class Command {
  constructor() {
    this.manager = null

    this.CommandError = CommandError

    this.name = null

    this.category = null

    this.aliases = null

    this.cooldown = 3

    this.maxUsageAmount = 1

    this.minArgs = null

    this.maxArgs = null

    this.permsBlacklist = null

    this.permsWhitelist = null

    this.allowedInDM = false

    this.allowedOnlyOwner = false

    this.execute = () => {}
  }

  setManager(manager) {
    this.manager = manager
    return this
  }

  setName(name) {
    this.name = name
    return this
  }

  setCategory(category) {
    this.category = category
    return this
  }
  
  setAliases(...aliases) {
    this.aliases = aliases
    return this
  }

  setCooldown(cooldown) {
    this.cooldown = cooldown
    return this
  }

  setMaxUsageAmount(maxUsageAmount) {
    this.maxUsageAmount = maxUsageAmount
    return this
  }

  setMinArgs(minArgs) {
    this.minArgs = minArgs
    return this
  }

  setMaxArgs(maxArgs) {
    this.maxArgs = maxArgs
    return this
  }

  addPermsToBlacklist(...perms) {
    this.permsBlacklist = new Discord.Permissions().add(...perms).freeze()
    return this
  }

  addPermsToWhitelist(...perms) {
    this.permsWhitelist = new Discord.Permissions().add(...perms).freeze()
    return this
  }

  get allowInDM() {
    this.allowedInDM = true
    return this
  }

  get allowOnlyOwner() {
    this.allowedOnlyOwner = true
    return this
  }

  setFunction(fn) {
    this.execute = fn
    return this
  }

  allowedToExecute(instance) {
    const userInstance = (user, message) => {
      if(this.allowedOnlyOwner && !this.manager.client.isOwner(user)) return false
      if(this.manager.client.isOwner(user)) return true
      if(!this.allowedInDM && message?.channel.type === 'dm') return false
      return true
    }
    const memberInstance = (member) => {
      if(this.allowedOnlyOwner && !this.manager.client.isOwner(member)) return false
      if(this.manager.client.isOwner(member)) return true
      if(member.permissions.any(Discord.Permissions.FLAGS.ADMINISTRATOR)) return true
      let allowed = Boolean
      if(this.permsBlacklist) allowed = true
      if(this.permsBlacklist) {
        if(this.permsBlacklist.any(member.permissions, false)) allowed = false
      }

      if(this.permsWhitelist) allowed = false
      if(this.permsWhitelist) {
        if(this.permsWhitelist.any(member.permissions, false)) allowed = true
      }
      return allowed
    }
    
    if(instance instanceof Discord.Message) {
      if(instance.channel.type === 'dm') return userInstance(instance.author, instance)
      else return memberInstance(instance.member)
    }
    if(instance instanceof Discord.GuildMember) return memberInstance(instance)
    return false
  }
}

module.exports = Command