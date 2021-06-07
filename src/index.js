require('dotenv').config()

const Discord = require('discord.js')

const ABClient = require('./utils/ABClient')

const client = new ABClient({ partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"], intents: Discord.Intents.ALL })

client.login()