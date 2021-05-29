module.exports = {
  name: 'say',
  permsWhitelist: ['ADMINISTRATOR'],
  execute(message, args, client) {
    const channel = message.mentions.channels.first()
    args.shift()

    if(message.deletable) message.delete()
    if(channel) channel.send(args.join(' '))
  }
}