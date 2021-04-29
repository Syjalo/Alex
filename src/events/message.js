const Discord = require('discord.js');

module.exports = (client) => {
	client.on('message', (message) => {
		if (message.content.startsWith('-')) {
			const embed = new Discord.MessageEmbed()
				.setTitle('The commands are temporarily disabled')
				.setDescription('We apologize')
				.setColor('#FF0000');
			message.channel.send(embed)
        .then(msg => {
          setTimeout(() => {
          if(!msg.deleted) msg.delete()
        }, 20000)
      });
		}
	});
};
