const Discord = require('discord.js')

class Command {
  constructor() {
    this.manager = null

    this.command = null

    this.options = null

    this.name = null

    this.description = null

    this.category = null

    this.cooldown = 3

    this.maxUsageAmount = 1

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

  setCommand(command) {
    this.command = command
    return this
  }

  setOption(option) {
    this.options = [option]
    return this
  }

  setOptions(options) {
    this.options = options
    return this
  }

  setName(name) {
    this.name = name
    return this
  }

  setDescription(description) {
    this.description = description
    return this
  }

  setCategory(category) {
    this.category = category
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
    const userInstance = (user, interaction) => {
      if(this.allowedOnlyOwner && !this.manager.client.isOwner(user)) return false
      if(this.manager.client.isOwner(user)) return true
      if(!this.allowedInDM && interaction?.channel.type === 'dm') return false
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
    
    if(instance instanceof Discord.CommandInteraction) {
      if(instance.channel.type === 'dm') return userInstance(instance.user, instance)
      else return memberInstance(instance.member)
    }
    if(instance instanceof Discord.GuildMember) return memberInstance(instance)
    return false
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      options: this.options
    }
  }
}

module.exports = Command