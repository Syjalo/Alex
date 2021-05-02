const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const welcomeMessageSchema = require('../schemas/welcome-messages-schema')

module.exports = async (client) => {
  client.commands = new Discord.Collection()
  client.cooldowns = new Discord.Collection()
  client.welcomeMessages = new Discord.Collection()
  client.mongo = require('../utils/mongo')
  client.config = require('../config.json')

  await client.mongo().then(async (mongoose) => {
    let response
    try {
      response = await welcomeMessageSchema.find()
    } finally {
      mongoose.connection.close()
    }
    if(response) {
      response.forEach(c => {
        client.welcomeMessages.set(c.guildId, { channelId: c.channelId, message: c.message })
      })
    }
  })

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for(const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if(stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else {
        const command = require(path.join(__dirname, dir, file))
        client.commands.set(command.name, command)
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
        event(client)
      }
    }
  }
  readEvents('../events')
}
