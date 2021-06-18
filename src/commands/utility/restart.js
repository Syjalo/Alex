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
  .setTimestamp()
  .setColor(client.constants.Colors.yellow)
  await Promise.all([client.owner.send({ embeds: [embed] }), message.channel.type !== 'dm' ? message.channel.send({ embeds: [embed] }) : null])
  process.exit(143)
})