const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true
}

const object = {
  type: Object
}

const string = {
  type: String
}

const usersSchema = mongoose.Schema({
  id: reqString,
  guilds: object,
  locale: string
})

module.exports = mongoose.model('users', usersSchema)
