const Discord = require('discord.js')
const Command = require('../../structures/Command')

module.exports = new Command()
.setName('restart')
.setCategory('utility')
.allowInDM
.allowOnlyOwner
.setFunction(async (message, args, client) => {
  const embed = new Discord.MessageEmbed()
  .setTitle('Restarting...')
  .setColor(client.constants.Colors.yellow)
  await client.owner.send(embed)
  process.exit(143)
})