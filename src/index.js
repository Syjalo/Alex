require('dotenv').config();

const Discord = require('discord.js');

const loader = require('./utils/loader');

const client = new Discord.Client();

loader(client);

client.login(process.env.TOKEN);
