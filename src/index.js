require('dotenv').config()

const Discord = require('discord.js')

const ABClient = require('./utils/ABClient')

const client = new ABClient({ allowedMentions: { parse: [], repliedUser: false }, intents: Discord.Intents.ALL })

client.login()