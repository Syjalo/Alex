const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const welcomeMessageSchema = mongoose.Schema({
  guildId: reqString,
  channelId: reqString,
  message: reqString,
})

module.exports = mongoose.model('welcomemessages', welcomeMessageSchema)
