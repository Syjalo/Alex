const Discord = require('discord.js')
const Command = require('../../structures/Command')

module.exports = new Command()
.setName('restart')
.setDescription('Restarts the bot.')
.setCategory('utility')
.allowInDM
.allowOnlyOwner
.setFunction(async (interaction, client) => {
  const embed = new Discord.MessageEmbed()
  .setTitle('Restarting...')
  .setTimestamp()
  .setColor('YELLOW')
  await Promise.all([client.owner.send({ embeds: [embed] }), interaction.channel.type !== 'dm' ? client.interactionSend(interaction, { embeds: [embed], ephemeral: true }) : null])
  process.exit(143)
})