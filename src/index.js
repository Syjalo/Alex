require('dotenv').config()

const Discord = require('discord.js')

const ABClient = require('./client/ABClient')

const client = new ABClient({ partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"], intents: Discord.Intents.ALL })

client.login()