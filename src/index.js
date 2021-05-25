require('dotenv').config()

const Discord = require('discord.js')

const ABClient = require('./utils/ABClient')

const client = new ABClient({ intents: Discord.Intents.ALL })

client.login()